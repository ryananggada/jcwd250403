const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Tenant } = require('../models');

exports.createTenant = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  const result = await Tenant.create({
    name,
    email,
    password,
    phoneNumber,
  });
  try {
    const isEmailTaken = await Tenant.findOne({ where: { email: email } });
    if (!isEmailTaken) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const result = await Tenant.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
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
    const tenant = await Tenant.findOne({ where: { email: email } });

    if (!tenant) {
      return res
        .status(404)
        .json({ ok: false, message: 'Email or password is wrong!' });
    }

    const isCorrectPass = await bcrypt.compare(password, tenant.password);

    if (!isCorrectPass) {
      return res
        .status(404)
        .json({ ok: false, message: 'Email or password is wrong!' });
    }

    const payload = {
      id: tenant.id,
      role: 'tenant',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    return res.json({
      ok: true,
      data: {
        token,
        id: tenant.id,
        email: tenant.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
