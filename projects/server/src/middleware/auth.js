const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.tokenValidator = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ ok: false, message: 'Token is not found' });
  }

  try {
    token = token.split(' ')[1];
    if (!token) {
      return res.status(401).json({ ok: false, message: 'Token is not found' });
    }

    const payload = jwt.verify(token, JWT_SECRET_KEY);
    if (!payload) {
      return res
        .status(401)
        .json({ ok: false, message: 'Failed to get authorization data' });
    }

    req.profile = payload;
    next();
  } catch (error) {
    return res.status(500).json({ ok: false, message: String(error) });
  }
};

exports.tenantValidator = (req, res, next) => {
  if (req.profile.role === 'tenant') {
    return next();
  }

  return res.status(403).json({ ok: false, message: 'Forbidden, tenant only' });
};

exports.userValidator = (req, res, next) => {
  if (req.profile.role === 'user') {
    return next();
  }

  return res.status(403).json({ ok: false, message: 'Forbidden, user only' });
};
