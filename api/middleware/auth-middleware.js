const jwt = require('jsonwebtoken');
const env = require('../env.json')
const { error } = require('../middleware/validate')

const message = {
  noToken: {
    title: 'Not Authorized',
    detail: 'No token provided',
    status: 401,
    timestamp: new Date(),
  },
  noPermissions: {
    title: 'Not Enough Permissions',
    detail: 'You do not have necessary roles to perform this action',
    status: 403,
    timestamp: new Date(),
  },
  invalid: {
    title: 'Invalid Token',
    detail: 'This token is not valid',
    status: 403,
    timestamp: new Date(),
  }
}

exports.requireToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json(error(message.noToken));

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_AUTH_SECRET);
    
    req.user = decoded;

  } catch (err) {
    return res.status(403).json(error(message.invalid));
  }
  return next();

}

exports.checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return next()

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_AUTH_SECRET);

    // add the decoded token to the request
    req.user = decoded;

  } catch (err) {
    console.log('checkToken:', err);
  }
  return next();
  
}

exports.requireInviteToken = (req, res, next) => {
  const token = req.params.token;

  if (!token) {
    return res.status(403).json(error(message.noToken));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_INVITE_SECRET);
    req.invite = decoded;
    req.body = {
      'firstName': decoded.invitation.firstName,
      'lastName': decoded.invitation.lastName,
      'email': decoded.invitation.email,
      'phone': decoded.invitation.phone,
      'invitedByUid': decoded.invitedByUid,
      ...req.body // overwrites the stuff already in the body
    }
  } catch (err) {
    return res.status(401).json(error(message.invalid));
  }
  return next();
    
}