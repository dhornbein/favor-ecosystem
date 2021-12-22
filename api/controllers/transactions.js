const transactions = require('../model/transactions')
const { v4: uuidv4 } = require('uuid')

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
    const { response, payload, errors, code } = await transactions.post(req.body)
    if (!errors) {
      res.status(201).json(success({
        message: "Transaction created successfully",
        data: payload,
      }))
      
    } else {
      console.log('Transaction Post', response);
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
    console.error('Controller',err)
    res.status(500).json(error(err))
  }
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