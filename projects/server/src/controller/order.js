const { Order, AvailableDate, Room, Property } = require('../models');
const { Op } = require('sequelize');
const schedule = require('node-schedule');

exports.addOrder = async (req, res) => {
  const { userId, roomId, startDate, endDate, totalPrice } = req.body;

  const dt = new Date(Date.parse(endDate) - 24 * 60 * 60 * 1000);
  const year = dt.getFullYear();
  const month = `0${dt.getMonth() + 1}`.slice(-2);
  const day = `0${dt.getDate()}`.slice(-2);

  const newEndDate = `${year}-${month}-${day}`;

  try {
    const result = await Order.create({
      userId,
      roomId,
      startDate,
      endDate,
      totalPrice,
      status: 'Pending',
    });

    const cancellationDate = new Date(result.createdAt);
    cancellationDate.setHourse(cancellationDate.getHours() + 2);

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
  const { page, sort = '', status = '', date = new Date() } = req.query;
  const userId = req.params.id;

  try {
    if (page || sort || status || date) {
      const orders = await Order.findAndCountAll({
        where: {
          userId,
          status: { [Op.like]: `%${status}%` },
          startDate: { [Op.eq]: date },
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
  const tenantId = req.params.id;

  try {
    const orders = await Order.findAll({
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

    return res.json({ ok: true, data: orders });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.uploadPaymentProof = async (req, res) => {
  const orderId = req.params.id;
  const paymentProof = req.file;

  try {
    const order = await Order.findOne({ where: { id: orderId } });
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
