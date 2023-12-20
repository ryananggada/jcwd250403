const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Verify, ResetPass } = require('../models');
const sendEmail = require('../middleware/email');
const generateOtp = require('../middleware/otp');
const fs = require('fs');
const fsp = require('fs/promises');
const hbs = require('handlebars');
const crypto = require('crypto');
const path = require('path');

exports.createUser = async (req, res) => {
  const { name, email, password, phoneNumber, gender, birthDate } = req.body;

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
        gender,
        birthDate,
      });

      const otp = generateOtp();
      const token = crypto.randomBytes(16).toString('hex');

      await Verify.create({
        userId: result.id,
        token: token,
        otp: otp,
        attemptsLeft: 4,
      });

      try {
        const templateRaw = fs.readFileSync(
          path.join(__dirname, '..', 'templates', 'verifyOtp.html'),
          'utf-8'
        );
        const templateCompile = hbs.compile(templateRaw);
        const emailHtml = templateCompile({
          domain: process.env.WHITELISTED_DOMAIN,
          token: token,
          otp: otp,
        });

        await sendEmail({
          email: email,
          subject: 'Verify your Pintuku account',
          html: emailHtml,
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
      name: user.name,
      role: 'user',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '24h',
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

exports.getUserProfile = async (req, res) => {
  const userId = req.profile.id;

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['name', 'email', 'gender', 'birthDate', 'profilePicture'],
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User profile not found!',
      });
    }

    return res.json({ ok: true, data: { user } });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.editUserProfile = async (req, res) => {
  const { name, gender, email, birthDate } = req.body;
  const userId = req.profile.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found.' });
    }

    user.name = name;
    user.gender = gender;
    user.email = email;
    user.birthDate = birthDate;
    await user.save();

    return res.json({ ok: true, data: user });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  const userId = req.profile.id;
  const profilePicture = req.file;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found.' });
    }

    if (user.profilePicture != null) {
      const oldProfilePicture = path.join(
        __dirname,
        '..',
        'public',
        user.picture
      );

      try {
        await fsp.unlink(oldProfilePicture);
      } catch (error) {
        return res.status(500).json({ ok: false, message: String(error) });
      }
    }

    user.profilePicture = profilePicture.filename;
    await user.save();

    return res.json({ ok: true, message: 'Profile picture updated!' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.profile.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found.' });
    }

    const isCorrectPass = await bcrypt.compare(oldPassword, user.password);

    if (!isCorrectPass) {
      return res.status(404).json({
        ok: false,
        message: 'Old password is wrong!',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashedPassword;
    user.save();

    return res.json({ ok: true, message: 'Password successfully updated.' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found!' });
    }

    await ResetPass.destroy({
      where: { userId: user.id },
    });

    const resetToken = crypto.randomBytes(16).toString('hex');

    await ResetPass.create({
      userId: user.id,
      token: resetToken,
    });

    try {
      const templateRaw = fs.readFileSync(
        path.join(__dirname, '..', 'templates', 'forgotPassword.html'),
        'utf-8'
      );
      const templateCompile = hbs.compile(templateRaw);
      const emailHtml = templateCompile({
        domain: process.env.WHITELISTED_DOMAIN,
        resetToken: resetToken,
      });

      await sendEmail({
        email: user.email,
        subject: 'Reset your Pintuku account password',
        html: emailHtml,
      });
      return res.json({
        ok: true,
        message: 'Reset password link has been sent to your email.',
      });
    } catch (error) {
      return res.status(400).json({ ok: false, message: String(error) });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const resetToken = req.params.token;

  try {
    const resetPass = await ResetPass.findOne({ where: { token: resetToken } });
    if (!resetPass) {
      return res
        .status(404)
        .json({ ok: false, message: 'Reset password token not found!' });
    }

    const user = await User.findOne({ where: { id: resetPass.userId } });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found!' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashedPassword;
    user.save();
    await ResetPass.destroy({ where: { token: resetToken } });

    return res.json({
      ok: true,
      message: 'Password successfully reset to new one!',
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};
