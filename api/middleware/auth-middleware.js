var jwt = require('jsonwebtoken');
const env = require('../env.json')
const { error } = require('../middleware/validate')

const config = process.env;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json(error({
      title: "Not Authorized",
      detail: 'No token provided',
      status: 403,
      path: req.originalUrl,
      timestamp: new Date(),
    }));
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_AUTH_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json(error({
      message: 'Invalid token',
    }));
  }
  return next();
};

module.exports = verifyToken;