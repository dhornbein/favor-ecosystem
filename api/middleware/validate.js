const { check, validationResult } = require('express-validator')
const { get: getTransactions } = require('../model/transactions-model')
const { get: getMembers, auth: authMembers } = require('../model/members-model')
const { getInvites } = require('../model/auth-model')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')
const bcrypt = require('bcrypt');

const defaultCreditLimit = 1000
const saltRounds = 12

exports.error = data => {
  return {
    error: data
  }
}

exports.success = (data, { params, query, body, msg } = {} ) => {
  return {
    success: (msg) ? msg : true,
    data: data,
    params,
    query,
    body
  }
}

exports.auth = [
  check('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('username can not be empty!')
    .bail()
    .custom(validateAuth),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    return res.status(422).json(this.error(errors.array()));
    next();
  },
]

async function validateAuth(value, { req }) {

  const { username, password } = req.body

  // fetch members from database
  const members = await authMembers()
  // if lowercase username does not matches throw error
  const member = members.find(member => member.username.toLowerCase() === username.toLowerCase())
  if (!member) throw new Error('Username does not match an existing a member')
  
  // if password does not match throw error
  const valid = await bcrypt.compare(password, member.password)
  if (!valid) throw new Error('Password does not match')

  // add member to request
  req.member = member

  return true

}

exports.isBroker =  (req, res, next) => {
  if (isBroker(req.user)) {
    next();
    return true
  }
  
  return res.status(403).json(error({
    title: "Not Authorized",
    detail: 'You must be a broker to perform this action',
    status: 403,
    path: req.originalUrl,
    timestamp: new Date(),
  }))
}

// firstName, lastName, email, phone, favor, invitedByUid
exports.invite = [
  check('firstName')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('First name is required'),
  check('lastName')
    .trim()
    .escape(),
  check('email')
    .trim()
    .escape()
    .if(check('email').not().isEmpty())
    .custom(validateEmail)
    .withMessage('Invalid email address'),
  check('phone')
    .customSanitizer(normalizePhone),
  check('favor')
    .trim()
    .if(check('favor').not().isEmpty())
    .isNumeric()
    .withMessage('Favor amount must be a number')
    .custom(amount => amount > 0.001)
    .withMessage('Favor amount must be more than f0.001')
    .customSanitizer(sanitizeFavor), // round to 3 decimal places 0.001
  check('invitedByUid')
    .not()
    .isEmpty()
    .withMessage('Must include a Uid of the inviting member')
    .custom(uuidValidate)
    .withMessage('Invalid Uid')
    .custom((value, { req }) => req.user.uid == value || req.user.roles['broker'] ) // check that the auth token's owner is the same as the invitedByID
    .withMessage('Auth token Uid must match invitedByUid!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json(this.error(errors.array()));
    next();
  },
]

exports.transaction = [
  check('recipientUid')
    .trim()
    .not()
    .isEmpty()
    .withMessage('recipientUid can not be empty!')
    .bail()
    .custom(uuidValidate)
    .withMessage('Invalid Uid')
    .bail(),
  check('payeeUid')
    .trim()
    .not()
    .isEmpty()
    .withMessage('PayeeUid can not be empty!')
    .bail()
    .custom(uuidValidate)
    .withMessage('Invalid Uid')
    .bail()
    .custom(validateTransaction),
  check('brokerUid')
    .trim(),
  check('amount')
    .exists()
    .withMessage('Transaction amount is required')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Amount can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom(amount => amount > 0.001)
    .withMessage('Amount must be more than f0.001')
    .customSanitizer(sanitizeFavor), // round to 3 decimal places 0.001
  check('effectiveDatetime')
    .trim()
    .customSanitizer(value =>
      Date.parse(value) && Date.parse(value) > Date.now()
        ? new Date(value).toISOString()
        : new Date().toISOString()
    ),
  check('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Title can not be empty!')
    .custom(value => value.length <= 140) // TODO move this to a config file
    .withMessage('Title must be less than 140 characters'),
  check('description')
    .trim()
    .escape(),
  check('created')
    .customSanitizer(value => new Date().toISOString()),
  check('uid')
    .customSanitizer(value => uuidv4()),
  check('ipAddress')
    .customSanitizer((value, { req }) => req.ip),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json(this.error(errors.array()));
    next();
  },
];

async function validateTransaction(value, { req }) {
  // fetch members from database
  const members = await getMembers()
  
  const { payeeUid, recipientUid, brokerUid } = req.body
  const payee = members.find(member => member.uid === payeeUid)
  const recipient = members.find(member => member.uid === recipientUid)
  const broker = (brokerUid) ? members.find(member => member.uid === brokerUid) : null

  if (payeeUid === recipientUid)
    throw new Error('Payee and recipient can not be the same!')

  // if payee or recipient is not found, throw error
  if (payee === undefined)
    throw new Error('Payee does not match an existing a member');

  if (recipient === undefined)
    throw new Error('Recipient does not match an existing a member');

  if (brokerUid && broker === undefined)
    throw new Error('Broker does not match an existing a member');
  // check if payeeUid and recipientUid are the same person

  return true
}

exports.inviteToken = [
  check('token')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Invite token is required')
    .bail()
    .custom(validateInviteToken),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json(this.error(errors.array()));
    next();
  },
];

async function validateInviteToken(value, { req }){
  // get list of invite tokens
  const invites = await getInvites()
  const foundInvite = invites.find(invite => invite.token == value)

  if (!foundInvite)
    throw new Error('Token is invalid')

  if (foundInvite.claimed || foundInvite.revoked)
    throw new Error('Token has already been claimed')
}

exports.member = [
  check('brokerUid')
    .trim()
    .if(check('brokerUid').exists().not().isEmpty())
    .custom(uuidValidate)
    .withMessage('Invalid Broker Uid'),
  check('invitedByUid')
    .trim()
    .if(check('invitedByUid').exists().not().isEmpty())
    .custom(uuidValidate)
    .withMessage('Invalid Invited By Uid'),
  check('phone')
    .customSanitizer(normalizePhone),
  check('email')
    .trim()
    .escape()
    .custom(validateEmail)
    .withMessage('Invalid email address'),
  check('firstName')
    .trim()
    .escape(),
  check('lastName')
    .trim()
    .escape(),
  check('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('username can not be empty!')
    .bail()
    .custom(value => value.length >= 4) // TODO move this to a config file
    .withMessage('username must be more than 4 characters')
    .custom(value => value.length <= 20) // TODO move this to a config file
    .withMessage('username must be less than 20 characters')
    .bail()
    .custom(validateMember),
  check('creditLimit')
    .default(defaultCreditLimit)
    .trim()
    .isNumeric()
    .withMessage('Credit limit must be a number')
    .custom(amount => amount > 0.001)
    .withMessage('Credit limit must be more than f0.001')
    .customSanitizer(sanitizeFavor), // round to 3 decimal places 0.001
  check('created')
    .customSanitizer(value => new Date().toISOString()),
  check('password')
    .customSanitizer(value => bcrypt.hash(value, saltRounds)),
  (req, res, next) => {
    const errors = validationResult(req);
    const blockList = ['balance','credit','debit','transactionTotal']

    req.body = removeObjKeys(req.body, blockList)
    req.body = removeObjBlanks(req.body)

    if (!errors.isEmpty())
      return res.status(422).json(this.error(errors.array()));
    next();
  },
];

// used with validate invite as well!
async function validateMember(value, { req }) {
  // fetch members from database
  const members = await getMembers()

  const { username, email, phone, invitedByUid, brokerUid } = req.body

  const foundEmail = members.find(member => member.email === email)
  const foundPhone = phone ? members.find(member => member.phone === phone) : false
  const foundUsername = members.find(member => member.username === username)
  const foundInviter = members.find(member => member.uid === invitedByUid)
  const foundBroker = members.find(member => member.uid === brokerUid)
  
  if (foundEmail)
    throw new Error('Email is already in use')

  if (foundPhone)
    throw new Error('Phone number is already in use')

  if (foundUsername)
    throw new Error('Username is already in use')

  if (!phone && !email)
    throw new Error('Phone number OR email is required')

  if (invitedByUid && !foundInviter)
    throw new Error('Inviter doesn\'t match any members')

  if (brokerUid && !foundBroker)
    throw new Error('BrokerUid doesn\'t match any members')

  return true
}

exports.memberUpdate = [
  check('brokerUid')
    .trim()
    .if(check('brokerUid').exists().not().isEmpty())
    .custom(uuidValidate)
    .withMessage('Invalid Broker Uid'),
  check('phone')
    .customSanitizer(normalizePhone),
  check('email')
    .if(check('email').exists())
    .trim()
    .escape()
    .custom(validateEmail)
    .withMessage('Invalid email address'),
  check('firstName')
    .trim()
    .escape(),
  check('lastName')
    .trim()
    .escape(),
  check('username')
    .if(check('username').exists())
    .trim()
    .custom(value => value.length >= 4) // TODO move this to a config file
    .withMessage('username must be more than 4 characters')
    .custom(value => value.length <= 20) // TODO move this to a config file
    .withMessage('username must be less than 20 characters')
    .bail()
    .custom(validateMemberUpdate),
  check('creditLimit')
    .if(check('creditLimit').exists())
    .custom((value, { req }) => isBroker(req.user))
    .withMessage('You are not allowed to change credit limit')
    .bail()
    .trim()
    .isNumeric()
    .withMessage('Credit limit must be a number')
    .custom(amount => amount > 0.001)
    .withMessage('Credit limit must be more than f0.001')
    .customSanitizer(sanitizeFavor), // round to 3 decimal places 0.001
  check('password')
    .if(check('password').exists())
    .customSanitizer(value => bcrypt.hash(value, saltRounds)),
  check('updated')
    .default(new Date().toISOString()),
  (req, res, next) => {
    const errors = validationResult(req)
    const schema = ['username', 'firstName', 'lastName', 'BrokerUid', 'phone', 'email', 'password','creditLimit','updated']

    req.body = filterObjKeys(req.body, schema)
    req.body = removeObjBlanks(req.body)

    if (!errors.isEmpty())
      return res.status(422).json(this.error(errors.array()));
    next();
  },
];

async function validateMemberUpdate(value, { req }) {
  // fetch members from database
  const members = await getMembers()

  const { username, email, phone, brokerUid } = req.body

  const foundEmail = members.find(member => member.email === email && member.uid !== req.params.uid)
  const foundPhone = members.find(member => member.phone === phone && member.uid !== req.params.uid)
  const foundUsername = members.find(member => member.username === username && member.uid !== req.params.uid)
  const foundBroker = members.find(member => member.uid === brokerUid)
  
  if (foundEmail)
    throw new Error('Email is already in use')

  if (foundPhone)
    throw new Error('Phone number is already in use')

  if (foundUsername)
    throw new Error('Username is already in use')

  if (brokerUid && !foundBroker)
    throw new Error('BrokerUid doesn\'t match any members')

  return true
}


function isBroker(user) {
  return user.roles && user.roles.includes('broker')
}

function removeObjBlanks(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== '')
      acc[key] = obj[key]
    return acc
  }, {})
}

function filterObjKeys(obj, schema) {
  return Object.keys(obj).reduce((acc, key) => {
    if (schema.includes(key))
      acc[key] = obj[key]
    return acc
  }, {})
}

function removeObjKeys(obj, schema) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!schema.includes(key))
      acc[key] = obj[key]
    return acc
  }, {})
}

// round to 3 decimal places 0.001
function sanitizeFavor(value) {
  return Math.round(parseFloat(value) * 1000) / 1000
}

function normalizePhone(number) {
  if (!number) return ''
  number = number.replace(/[^\d+]+/g, '')
  number = number.replace(/^00/, '+')
  if (number.match(/^1/)) number = '+' + number
  if (!number.match(/^\+/)) number = '+1' + number
  return number
}

function validateEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}