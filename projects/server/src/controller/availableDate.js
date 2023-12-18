const { AvailableDate } = require('../models');

exports.addAvailableDate = async (req, res) => {
  const { date, pricePercentage } = req.body;
  const roomId = req.params.id;

  try {
    const result = await AvailableDate.create({
      roomId,
      date,
      pricePercentage,
      isAvailable: true,
    });

    return res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: String(error),
    });
  }
};

exports.getAvailableDates = async (req, res) => {
  const roomId = req.params.id;

  try {
    const result = await AvailableDate.findAll({
      where: { roomId: roomId, isAvailable: true },
    });

    return res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
