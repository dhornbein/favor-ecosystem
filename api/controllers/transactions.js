const transactions = require('../model/transactions')

exports.get = async (req, res, next) => {

  try {
    const trans = await transactions.get(req.params)
    console.log('controller',trans);
    res.status(200).send({ data: trans })
  } catch(err) {
    console.error(err)
  }
  
}

exports.post = async (req, res, next) => {
  
}