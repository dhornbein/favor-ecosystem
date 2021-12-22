const transactions = require('../model/transactions')
const { check, validationResult } = require('express-validator');
const { v4: uuidv4, validate: uuidValidate } = require('uuid')

exports.get = async (req, res, next) => {

  try {
    const trans = await transactions.get(req.params)

    if (req.params.id) {
      const found = trans.find(row => row.id === parseInt(req.params.id))

      if (found) {
        res.status(200).json({ data: found })
      } else {
        res.status(404).json(error({
          title: "Transaction Not Found",
          detail: "No transactions found with that ID",
          status: 404,
          path: req.originalUrl,
          timestamp: new Date(),
        }))
      }
    } else {
      res.status(200).json({ data: trans })
    }
  } catch(err) {
    console.error(err)
    res.status(500).json(error(err))
  }
  
}

exports.post = async (req, res, next) => {
  try {
    // build new transaction object
    const newTransaction = {
      uuid: uuidv4(),
      ip_address: req.ip,
      created: new Date().toISOString(),
      ...req.body
    }

    // validate new transaction object

    const { response, payload, errors, code } = await transactions.post(newTransaction)
    if (!errors) {
      res.status(201).json(success({
        message: "Transaction created successfully",
        data: payload,
      }))
      
    } else {
      console.log('Transaction Post Error', response);
      res.status(code).json(error({
        title: "Transaction Creation Failed",
        detail: "Something went wrong applying the transaction to the database",
        status: code,
        path: req.originalUrl,
        timestamp: new Date(),
        errors: errors
      }))
    }

  } catch(err) {
    console.error('Controller Error',err)
    res.status(500).json(error(err))
  }
}

exports.validation = [
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
    .escape()
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json(error(errors.array()));
    next();
  },
];

function validateTransaction(value, { req }) {
  // TODO
  // pull members data from the database
  
  // check if payeeId, recipientId, and brokerId exists in the database

  // check if payeeId and recipientId are the same person

  return true
}

function error(data){
  return {
    error: data
  }
}

function success(data){
  return {
    success: data
  }
}