const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: 'Pintuku Support<no-reply@pintuku.com>',
    to: option.email,
    subject: option.subject,
    html: option.html,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
