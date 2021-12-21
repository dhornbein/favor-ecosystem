const transactions = require('../model/transactions')

const SPREADSHEET_ID = env.SPREADSHEET_ID
const TRANSACTION_RANGE = 'Transactions!A:N'


exports.get = async (req, res, next) => {

  try {
    const trans = await transactions.get(req.params)
    res.status(200).send({ data: trans })
  } catch(err) {
    console.error(err)
  }
  
}

exports.post = async (req, res, next) => {
  
}