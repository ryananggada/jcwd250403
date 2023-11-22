const { User, Verify } = require('../models');
const generateOtp = require('../middleware/otp');

exports.verifyAccount = async (req, res) => {
  const { otp } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (user.isVerified) {
      return res
        .status(400)
        .json({ ok: false, message: 'User is already verified!' });
    }

    const verify = await Verify.findOne({ where: { userId: userId } });

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

      await Verify.destroy({ where: { userId: userId } });

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
  const userId = req.params.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    const verify = await Verify.findOne({ where: { userId: userId } });

    if (user.isVerified) {
      return res
        .status(400)
        .json({ ok: false, message: 'User is already verified!' });
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

    const message = `Welcome to Pintuku! In order to verify your account, please input this OTP code: ${verify.otp}.`;

    await sendEmail({
      email: user.email,
      subject: 'Verify your Pintuku account',
      message,
    });

    return res.json({
      ok: true,
      message: 'New OTP has been resend, please check your email.',
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
