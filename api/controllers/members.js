const members = require('../model/members')
const { check, validationResult } = require('express-validator');
const { v4: uuidv4, validate: uuidValidate } = require('uuid')

exports.get = async (req, res, next) => {

  try {
    const trans = await members.get(req.params)

    if (req.params.id) {
      const found = trans.find(row => row.id === parseInt(req.params.id))

      if (found) {
        res.status(200).json({ data: found })
      } else {
        res.status(404).json(error({
          title: "Member Not Found",
          detail: "No members found with that ID",
          status: 404,
          path: req.originalUrl,
          timestamp: new Date(),
        }))
      }
    } else {
      res.status(200).json({ data: trans })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(error(err))
  }

}

exports.post = async (req, res, next) => {
  try {
    // build new member object
    const newMember = {
      uuid: uuidv4(),
      created: new Date().toISOString(),
      ...req.body
    }

    // validate new transaction object

    const { response, payload, errors, code } = await members.post(newMember)
    if (!errors) {
      res.status(201).json(success({
        message: `Member created successfully`,
        data: payload,
      }))

    } else {
      console.log('Member Post Error', response);
      res.status(code).json(error({
        title: "Member Creation Failed",
        detail: "Something went wrong applying the member to the database",
        status: code,
        path: req.originalUrl,
        timestamp: new Date(),
        errors: errors
      }))
    }

  } catch (err) {
    console.error('Controller Error', err)
    res.status(500).json(error(err))
  }
}

exports.validation = [
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

function error(data) {
  return {
    error: data
  }
}

function success(data) {
  return {
    success: data
  }
}