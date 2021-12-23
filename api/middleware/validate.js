const { check, validationResult } = require('express-validator');
const { get: getTransactions } = require('../model/transactions-model')
const { get: getMembers } = require('../model/members-model')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')

exports.error = data => {
  return {
    error: data
  }
}

exports.success = data => {
  return {
    success: data
  }
}

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

exports.member = [
  check('balance')
    .not()
    .exists()
    .withMessage('Do not include balance in the request body'),
  check('credit')
    .not()
    .exists()
    .withMessage('Do not include credit in the request body'),
  check('debit')
    .not()
    .exists()
    .withMessage('Do not include debit in the request body'),
  check('transactionTotal')
    .not()
    .exists()
    .withMessage('Do not include transaction total in the request body'),
  check('BrokerId')
    .trim()
    .if(check('BrokerId').exists().not().isEmpty())
    .custom(uuidValidate)
    .withMessage('Invalid Broker UUID'),
  check('InvitedById')
    .trim()
    .if(check('InvitedById').exists().not().isEmpty())
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
    .bail()
    .custom(value => value.length <= 20) // TODO move this to a config file
    .withMessage('username must be less than 20 characters')
    .bail()
    .custom(validateMember),
  check('creditLimit')
    .exists()
    .withMessage('Credit limit is required')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Credit limit can not be empty')
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

async function validateMember(value, { req }) {
  // fetch members from database
  const members = await getMembers()

  const { username, email, phone } = req.body

  const foundEmail = members.find(member => member.email === email)
  const foundPhone = members.find(member => member.phone === phone)
  const foundUsername = members.find(member => member.username === username)
  
  if (foundEmail)
    throw new Error('Email is already in use')

  if (foundPhone)
    throw new Error('Phone number is already in use')

  if (foundUsername)
    throw new Error('Username is already in use')

  if (!phone && !email)
    throw new Error('Phone number OR email is required')

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