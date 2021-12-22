const { check, validationResult } = require('express-validator');
const { get: getTransactions } = require('../model/transactions')
const { get: getMembers } = require('../model/members')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')
const { error, success } = require('../utilities/index')

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
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom(amount => amount > 0.001)
    .withMessage('Amount must be more than f0.001')
    .customSanitizer(value => Math.round(parseFloat(value) * 1000) / 1000), // round to 3 decimal places 0.001
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
      return res.status(422).json(error(errors.array()));
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
    throw new Error('Payee and recipient can not have the same!')

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
  check('created')
    .customSanitizer(value => new Date().toISOString()),
  check('firstName')
    .trim()
    .escape(),
  check('lastName')
    .trim()
    .escape(),
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
    .customSanitizer(value => Math.round(parseFloat(value) * 1000) / 1000), // round to 3 decimal places 0.001
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
    .trim()
    .escape(),
  check('email')
    .trim()
    .escape(),
  // .custom((val) => /[^A-za-z0-9\s]/g.test(val)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json(error(errors.array()));
    next();
  },
];

function validateMember(value, { req }) {
  // TODO
  // pull members data from the database

  // check if payeeId, recipientId, and brokerId exists in the database

  // check if payeeId and recipientId are the same person

  return true
}