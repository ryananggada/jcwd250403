const { User, Verify } = require('../models');
const generateOtp = require('../middleware/otp');
const sendEmail = require('../middleware/email');
const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');

exports.verifyAccount = async (req, res) => {
  const { otp } = req.body;
  const token = req.params.token;

  try {
    const verify = await Verify.findOne({ where: { token: token } });
    if (!verify) {
      return res
        .status(404)
        .json({ ok: false, message: 'Verification not found!' });
    }

    const user = await User.findOne({ where: { id: verify.userId } });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found!' });
    }

    if (
      verify.updatedAt.getTime() >=
      new Date().getTime() + 1 * 24 * 60 * 60 * 1000
    ) {
      return res.status(400).json({
        ok: false,
        message: 'OTP is expired, please request a new OTP.',
      });
    }

    if (otp === verify.otp) {
      user.isVerified = true;
      user.save();

      await Verify.destroy({ where: { userId: user.id } });

      return res.json({
        ok: true,
        message:
          'Account verified, now you can login and happy renting with Pintuku!',
      });
    }
    return res
      .status(400)
      .json({ ok: false, message: 'OTP does not match, please input again.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.resendOtp = async (req, res) => {
  const token = req.params.token;

  try {
    const verify = await Verify.findOne({ where: { token: token } });

    if (!verify) {
      return res
        .status(404)
        .json({ ok: false, message: 'Verification not found!' });
    }

    const user = await User.findOne({ where: { id: verify.userId } });
    if (!user) {
      return res.status(404).json({ ok: false, meessage: 'User not found!' });
    }

    if (new Date().toDateString() > verify.updatedAt.toDateString()) {
      verify.attemptsLeft = 5;
    }

    if (verify.attemptsLeft <= 0) {
      return res.status(400).json({
        ok: false,
        message:
          'Too many OTP request attempts, please wait tomorrow to verify.',
      });
    }

    verify.attemptsLeft -= 1;
    verify.otp = generateOtp();
    verify.save();

    try {
      const templateRaw = fs.readFileSync(
        path.join(__dirname, '..', 'templates', 'verifyOtp.html'),
        'utf-8'
      );
      const templateCompile = hbs.compile(templateRaw);
      const emailHtml = templateCompile({
        domain: process.env.WHITELISTED_DOMAIN,
        token: token,
        otp: verify.otp,
      });

      await sendEmail({
        email: user.email,
        subject: 'Verify your Pintuku account',
        html: emailHtml,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ ok: false, message: 'Failed to resend OTP email.' });
    }

    return res.json({
      ok: true,
      message: 'New OTP has been resend, please check your email.',
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.getUserEmail = async (req, res) => {
  const token = req.params.token;

  try {
    const verify = await Verify.findOne({
      where: { token: token },
      attributes: ['userId'],
      include: [{ model: User, as: 'user', attributes: ['email'] }],
    });
    return res.json({ ok: true, data: verify });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
