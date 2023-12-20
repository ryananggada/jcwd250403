const {
  Order,
  AvailableDate,
  Room,
  Property,
  User,
  Review,
} = require('../models');
const { Op } = require('sequelize');
const schedule = require('node-schedule');
const fs = require('fs');
const hbs = require('handlebars');
const path = require('path');
const sendEmail = require('../middleware/email');

exports.addOrder = async (req, res) => {
  const userId = req.profile.id;
  const { roomId, startDate, endDate, totalPrice } = req.body;

  const dt = new Date(Date.parse(endDate) - 24 * 60 * 60 * 1000);
  const year = dt.getFullYear();
  const month = `0${dt.getMonth() + 1}`.slice(-2);
  const day = `0${dt.getDate()}`.slice(-2);

  const newEndDate = `${year}-${month}-${day}`;

  const generateInvoiceId = () => {
    const randomNumber1 = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(5, '0');
    const randomNumber2 = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, '0');

    const invoiceID = `INV-${randomNumber1}-${randomNumber2}`;

    return invoiceID;
  };

  try {
    const result = await Order.create({
      userId,
      roomId,
      invoiceId: generateInvoiceId(),
      startDate,
      endDate,
      totalPrice,
      status: 'Pending',
    });

    const cancellationDate = new Date(result.createdAt);
    cancellationDate.setHours(cancellationDate.getHours() + 2);

    schedule.scheduleJob(cancellationDate, async () => {
      try {
        const order = await Order.findByPk(result.id);
        if (order && order.status === 'Pending') {
          order.status = 'Cancelled';
          await order.save();

          await AvailableDate.update(
            { isAvailable: true },
            {
              where: {
                roomId: order.roomId,
                date: { [Op.between]: [order.startDate, newEndDate] },
                isAvailable: false,
              },
            }
          );
        }
      } catch (error) {
        console.log('Error cancelling order: ', error);
      }
    });

    await AvailableDate.update(
      { isAvailable: false },
      {
        where: {
          roomId,
          date: { [Op.between]: [startDate, newEndDate] },
          isAvailable: true,
        },
      }
    );

    return res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getSingleOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: Room,
          as: 'room',
          include: [{ model: Property, as: 'property' }],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: 'Room not found.',
      });
    }

    return res.json({ ok: true, data: order });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.cancelOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
      },
    });
    order.status = 'Cancelled';
    order.save();

    const dt = new Date(Date.parse(order.endDate) - 24 * 60 * 60 * 1000);
    const year = dt.getFullYear();
    const month = `0${dt.getMonth() + 1}`.slice(-2);
    const day = `0${dt.getDate()}`.slice(-2);
    const newEndDate = `${year}-${month}-${day}`;

    await AvailableDate.update(
      { isAvailable: true },
      {
        where: {
          roomId: order.roomId,
          date: { [Op.between]: [order.startDate, newEndDate] },
          isAvailable: false,
        },
      }
    );

    return res.json({ ok: true, message: 'Order successfully cancelled!' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getOrdersAsUser = async (req, res) => {
  const {
    page,
    sort = '',
    status = '',
    invoiceId = '',
    date = new Date(),
  } = req.query;
  const userId = req.profile.id;

  try {
    if (page || sort || status || invoiceId || date) {
      const orders = await Order.findAndCountAll({
        where: {
          userId,
          status: { [Op.like]: `%${status}%` },
          startDate: { [Op.lte]: date },
          endDate: { [Op.gte]: date },
          invoiceId: { [Op.like]: `%${invoiceId}%` },
        },
        order: [[sort, 'DESC']],
        offset: 5 * ((page ? page : 1) - 1),
        limit: 5,
      });

      return res.json({ ok: true, count: orders.count, data: orders.rows });
    }

    const orders = await Order.findAll({ where: { userId } });
    return res.json({ ok: true, data: orders });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getOrdersAsTenant = async (req, res) => {
  const { status, page } = req.query;
  const tenantId = req.profile.id;

  try {
    const orders = await Order.findAndCountAll({
      where: { status: { [Op.like]: `%${status}%` } },
      include: [
        {
          model: Room,
          as: 'room',
          require: true,
          include: [
            {
              model: Property,
              as: 'property',
              where: { tenantId },
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
      order: [['updatedAt', 'ASC']],
      offset: 5 * ((page ? page : 1) - 1),
      limit: 5,
    });

    return res.json({ ok: true, count: orders.count, data: orders.rows });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.uploadPaymentProof = async (req, res) => {
  const orderId = req.params.id;
  const paymentProof = req.file;

  try {
    const order = await Order.findOne({
      where: { id: orderId },
    });
    if (!order) {
      return res.status(404).json({ ok: false, message: 'Order not found!' });
    }

    order.paymentProof = paymentProof.filename;
    order.status = 'Waiting';
    await order.save();

    return res.json({ ok: true, message: 'Payment proof uploaded.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.confirmOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Room,
          as: 'room',
          attributes: ['propertyId', 'roomType'],
          include: {
            model: Property,
            as: 'property',
          },
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ ok: false, message: 'Order not found!' });
    }

    order.status = 'Complete';
    await order.save();

    const existingReviews = await Review.findAll({
      where: { userId: order.user.id, propertyId: order.room.propertyId },
    });
    if (existingReviews.length === 0) {
      await Review.create({
        propertyId: order.room.propertyId,
        userId: order.user.id,
        rating: 0,
        comment: '',
        isDone: false,
      });
    }

    try {
      const templateRaw = fs.readFileSync(
        path.join(__dirname, '..', 'templates', 'orderSuccess.html'),
        'utf-8'
      );
      const templateCompile = hbs.compile(templateRaw);

      const sd = new Date(order.startDate);
      const ed = new Date(order.endDate);

      let sDay = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(sd);
      let sMonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(sd);
      let sYear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(sd);

      let eDay = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(ed);
      let eMonth = new Intl.DateTimeFormat('en', { month: 'short' }).format(ed);
      let eYear = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(ed);

      const emailHtml = templateCompile({
        orderId: order.invoiceId,
        propertyName: order.room.property.name,
        roomName: order.room.roomType,
        startDate: `${sDay} ${sMonth} ${sYear}`,
        endDate: `${eDay} ${eMonth} ${eYear}`,
        totalPrice:
          'Rp ' + new Intl.NumberFormat('id-ID').format(order.totalPrice),
      });

      await sendEmail({
        email: order.user.email,
        subject: 'Order completed',
        html: emailHtml,
      });
    } catch (error) {
      return res.status(400).json({ ok: false, message: String(error) });
    }
    return res.json({ ok: true, message: 'Order successfully confirmed.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.rejectOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ ok: false, message: 'Order not found!' });
    }

    order.status = 'Pending';
    await order.save();

    return res.json({ ok: true, message: 'Order successfully rejected.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getOrderReports = async (req, res) => {
  const tenantId = req.profile.id;

  try {
    const waitingOrdersCount = await Order.count({
      where: {
        status: {
          [Op.or]: [{ [Op.like]: '%Waiting%' }, { [Op.like]: '%Pending%' }],
        },
      },
      include: [
        {
          model: Room,
          as: 'room',
          require: true,
          include: [
            {
              model: Property,
              as: 'property',
              where: { tenantId },
            },
          ],
        },
      ],
    });

    const successOrdersCount = await Order.count({
      where: { status: { [Op.like]: `%Complete%` } },
      include: [
        {
          model: Room,
          as: 'room',
          require: true,
          include: [
            {
              model: Property,
              as: 'property',
              where: { tenantId },
            },
          ],
        },
      ],
    });

    return res
      .status(200)
      .json({ ok: true, waitingOrdersCount, successOrdersCount });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
