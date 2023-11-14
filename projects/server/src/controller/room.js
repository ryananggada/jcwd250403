const { Room, Property } = require('../models');

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

  try {
    if (page || sort || search) {
      const rooms = await Room.findAndCountAll({
        where: {
          roomType: { [Op.like]: `${search}` },
        },
        attributes: { exclude: ['propertyId'] },
        include: [{ model: Property, as: 'property' }],
        order: [['roomType', sort ? sort : 'ASC']],
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
      include: [{ model: Property, as: 'property' }],
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
      include: [{ model: Property, as: 'property' }],
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
