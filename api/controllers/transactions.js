const transactions = require('../model/transactions')

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
  }
  
}

exports.post = async (req, res, next) => {
  
}

function error(data){
  return {
    error: data
  }
}