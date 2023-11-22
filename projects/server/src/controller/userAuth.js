const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Verify } = require('../models');
const sendEmail = require('../middleware/email');
const generateOtp = require('../middleware/otp');

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

      const otp = generateOtp();

      await Verify.create({
        userId: result.id,
        otp: otp,
        attemptsLeft: 4,
      });

      const message = `Welcome to Pintuku! In order to verify your account, please input this OTP code: ${otp}.`;

      try {
        await sendEmail({
          email: email,
          subject: 'Verify your Pintuku account',
          message,
        });
        return res.json({ ok: true, data: result });
      } catch (error) {
        return res.status(400).json({ ok: false, message: String(error) });
      }
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

    if (!user.isVerified) {
      return res.status(400).json({
        ok: false,
        message: 'User is not verified, please verify first!',
      });
    }

    const payload = {
      id: user.id,
      role: 'user',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '2h',
    });

    return res.json({
      ok: true,
      data: {
        token,
        payload,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getEmail = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['email'],
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Email or password is wrong!',
      });
    }

    return res.json({ ok: true, data: { user } });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
