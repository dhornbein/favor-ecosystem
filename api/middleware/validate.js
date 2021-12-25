const { check, validationResult } = require('express-validator')
const { get: getTransactions } = require('../model/transactions-model')
const { get: getMembers, auth: authMembers } = require('../model/members-model')
const { getInvites } = require('../model/auth-model')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')
const bcrypt = require('bcrypt');

const defaultCreditLimit = 1000

exports.error = data => {
  return {
    error: data
  }
}

exports.success = (data, message = true) => {
  return {
    success: message,
    ...data
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
  if (req.user && req.user.roles['broker']) {
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

// firstName, lastName, email, phone, favor, invitedById
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
    .custom(validateEmail)
    .withMessage('Invalid email address'),
  check('phone')
    .customSanitizer(normalizePhone),
  check('favor')
    .trim()
    .isNumeric()
    .withMessage('Favor amount must be a number')
    .custom(amount => amount > 0.001)
    .withMessage('Favor amount must be more than f0.001')
    .customSanitizer(sanitizeFavor), // round to 3 decimal places 0.001
  check('invitedById')
    .not()
    .isEmpty()
    .withMessage('Must include a UUID of the inviting member')
    .custom(uuidValidate)
    .withMessage('Invalid UUID')
    .custom((value, { req }) => req.user.uuid == value || req.user.roles['broker'] ) // check that the auth token's owner is the same as the invitedByID
    .withMessage('Auth token UUID must match invitedById!')
    .bail()
    .custom(validateMember), // checks for unique email & phone and if invited by ID exists
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json(this.error(errors.array()));
    next();
  },
]

exports.transaction = [
  check('recipientId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('recipientId can not be empty!')
    .bail()
    .custom(uuidValidate)
    .withMessage('Invalid UUID')
    .bail(),
  check('payeeId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('PayeeId can not be empty!')
    .bail()
    .custom(uuidValidate)
    .withMessage('Invalid UUID')
    .bail()
    .custom(validateTransaction),
  check('brokerId')
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
  check('uuid')
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
  
  const { payeeId, recipientId, brokerId } = req.body
  const payee = members.find(member => member.uuid === payeeId)
  const recipient = members.find(member => member.uuid === recipientId)
  const broker = (brokerId) ? members.find(member => member.uuid === brokerId) : null

  if (payeeId === recipientId)
    throw new Error('Payee and recipient can not be the same!')

  // if payee or recipient is not found, throw error
  if (payee === undefined)
    throw new Error('Payee does not match an existing a member');

  if (recipient === undefined)
    throw new Error('Recipient does not match an existing a member');

  if (brokerId && broker === undefined)
    throw new Error('Broker does not match an existing a member');
  // check if payeeId and recipientId are the same person

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
  check('balance')
    .customSanitizer(value => ''),
  check('credit')
    .customSanitizer(value => ''),
  check('debit')
    .customSanitizer(value => ''),
  check('transactionTotal')
    .customSanitizer(value => ''),
  check('brokerId')
    .trim()
    .if(check('brokerId').exists().not().isEmpty())
    .custom(uuidValidate)
    .withMessage('Invalid Broker UUID'),
  check('invitedById')
    .trim()
    .if(check('invitedById').exists().not().isEmpty())
    .custom(uuidValidate)
    .withMessage('Invalid Invited By UUID'),
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json(this.error(errors.array()));
    next();
  },
];

// used with validate invite as well!
async function validateMember(value, { req }) {
  // fetch members from database
  const members = await getMembers()

  const { username, email, phone, invitedById, brokerId } = req.body

  const foundEmail = members.find(member => member.email === email)
  const foundPhone = members.find(member => member.phone === phone)
  const foundUsername = members.find(member => member.username === username)
  const foundInviter = members.find(member => member.uuid === invitedById)
  const foundBroker = members.find(member => member.uuid === brokerId)
  
  if (foundEmail)
    throw new Error('Email is already in use')

  if (foundPhone)
    throw new Error('Phone number is already in use')

  if (foundUsername)
    throw new Error('Username is already in use')

  if (!phone && !email)
    throw new Error('Phone number OR email is required')

  if (invitedById && !foundInviter)
    throw new Error('Inviter doesn\'t match any members')

  if (brokerId && !foundBroker)
    throw new Error('BrokerId doesn\'t match any members')

  return true
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