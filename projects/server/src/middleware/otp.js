const crypto = require('crypto');

const generateOtp = () => {
  const otp = crypto.randomBytes(2).readUInt16BE(0) % 10000;
  return otp.toString().padStart(4, '0');
};

module.exports = generateOtp;
