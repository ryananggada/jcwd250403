const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User } = require('../models');

exports.createUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const isEmailTaken = await User.findOne({ where: { email: email } });

    if (!isEmailTaken) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const result = await User.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        isVerified: false,
      });

      return res.json({ ok: true, data: result });
    }
    return res
      .status(400)
      .json({ ok: false, message: 'Email is already taken.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Email or password is wrong!',
      });
    }

    const isCorrectPass = await bcrypt.compare(password, user.password);

    if (!isCorrectPass) {
      return res.status(404).json({
        ok: false,
        message: 'Email or password is wrong!',
      });
    }

    const payload = {
      id: user.id,
      role: 'user',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    return res.json({
      ok: true,
      data: {
        token,
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
