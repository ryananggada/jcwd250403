const { Room, Property, AvailableDate, Category } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.addRoom = async (req, res) => {
  const { propertyId, roomType, price, description } = req.body;

  try {
    const result = await Room.create({
      propertyId,
      roomType,
      price,
      description,
    });

    return res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.editRoom = async (req, res) => {
  const roomId = req.params.id;
  const { propertyId, roomType, price, description } = req.body;

  try {
    const room = await Room.findOne({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({
        ok: false,
        message: 'Room not found.',
      });
    }

    room.propertyId = propertyId;
    room.roomType = roomType;
    room.price = price;
    room.description = description;
    await room.save();

    return res.json({
      ok: true,
      data: {
        propertyId: room.propertyId,
        roomType: room.roomType,
        price: room.price,
        description: room.description,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.deleteRoom = async (req, res) => {
  const roomId = req.params.id;

  try {
    Room.destroy({ where: { id: roomId } }).then(function (rowDeleted) {
      if (rowDeleted === 1) {
        return res.json({ ok: true, message: 'Room successfully deleted.' });
      }

      return res.status(404).json({
        ok: false,
        message: 'Room not found.',
      });
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getAllRooms = async (req, res) => {
  const { page, sort = '', search = '' } = req.query;
  const tenantId = req.profile.id;

  try {
    if (page || sort || search) {
      const rooms = await Room.findAndCountAll({
        where: {
          roomType: { [Op.like]: `%${search}%` },
        },
        attributes: { exclude: ['propertyId'] },
        include: [{ model: Property, as: 'property', where: { tenantId } }],
        order: [
          ['propertyId', 'ASC'],
          ['roomType', sort ? sort : 'ASC'],
        ],
        offset: 5 * ((page ? page : 1) - 1),
        limit: 5,
      });

      return res.json({
        ok: true,
        count: rooms.count,
        data: rooms.rows,
      });
    }

    const rooms = await Room.findAll({
      attributes: { exclude: ['propertyId'] },
      include: [{ model: Property, as: 'property', where: { tenantId } }],
    });
    return res.json({ ok: true, data: rooms });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getSingleRoom = async (req, res) => {
  const roomId = req.params.id;

  try {
    const room = await Room.findOne({
      where: {
        id: roomId,
      },
      attributes: { exclude: ['propertyId'] },
      include: [
        {
          model: Property,
          as: 'property',
          attributes: { exclude: ['categoryId'] },
          include: [
            { model: Category, as: 'category', attributes: ['location'] },
          ],
        },
      ],
    });

    if (!room) {
      return res.status(404).json({
        ok: false,
        message: 'Room not found.',
      });
    }

    return res.json({ ok: true, data: room });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getRoomsByPropertyId = async (req, res) => {
  const propertyId = req.params.id;
  const { startDate, endDate } = req.query;

  const dt = new Date(Date.parse(endDate) - 24 * 60 * 60 * 1000);
  const year = dt.getFullYear();
  const month = `0${dt.getMonth() + 1}`.slice(-2);
  const day = `0${dt.getDate()}`.slice(-2);

  const newEndDate = `${year}-${month}-${day}`;

  try {
    const rooms = await Room.findAll({
      where: { propertyId: propertyId },
      include: [
        {
          model: AvailableDate,
          as: 'availableDates',
          where: {
            date: { [Op.between]: [startDate, newEndDate] },
            isAvailable: true,
          },
          order: [['date', 'ASC']],
        },
      ],
    });

    const roomsWithTotalPrice = rooms.map((room) => {
      const basePrice = room.price;
      const totalPrice = room.availableDates.reduce((acc, availableDate) => {
        return acc + basePrice * (1 + availableDate.pricePercentage);
      }, 0);

      return {
        ...room.toJSON(),
        totalPrice: totalPrice,
      };
    });

    return res.json({ ok: true, data: roomsWithTotalPrice });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
