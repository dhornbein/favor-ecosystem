const { Router } = require('express')
const transactionsController = require('../controllers/transactions')

const router = Router()

const use = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/transactions', use(transactionsController.get));
router.post('/transactions', use(transactionsController.post));

// const { query } = require('express-validator/check');


function GoogleDate(JSdate) {
  var D = new Date(JSdate);
  var Null = new Date(Date.UTC(1899, 11, 30, 0, 0, 0, 0)); // the starting value for Google
  return ((D.getTime() - Null.getTime()) / 60000 - D.getTimezoneOffset()) / 1440;
}


const numberFields = ['ID', 'payee_id', 'recipient_id', 'amount', 'fee']

async function getGoogleTransactions() {
  const request = {
    spreadsheetId: SPREADSHEET_ID,
    range: TRANSACTION_RANGE,
    auth: auth
  }
  try {
    const response = (await sheets.spreadsheets.values.get(request)).data;
    let headers = response.values.shift();
    let transactions = response.values.map(row => {
      return headers.reduce((obj, key, index) => {
        let value = numberFields.includes(key) ? parseFloat(row[index]) : row[index];
        return { ...obj, [key]: value };
      }, {});
    });
    return {transactions, headers}
  } catch (err) {
    throw err
  }
  }


router.get('/transactions', async (req, res) => {
  try {
    const {transactions} = await getGoogleTransactions()
    res.json(transactions)
  } catch (err) {
    console.log(err);
    res.status(500).json( err )
  }

})

/* GET member by ID. */
router.get('/transactions/:id', async (req, res, next) =>{
  try {
    let { transactions } = await getGoogleTransactions()
    const id = parseInt(req.params.id)
    const transaction = transactions.filter(obj => (obj.payee_id === id || obj.recipient_id === id))
    if (transaction.length > 0) {
      res.json(transaction)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
})

router.post('/transactions/create', async (req, res, next) => {
  try {
    const { transactions, headers } = await getGoogleTransactions()
    // find the next id from the transactions array
    const nextId = transactions.length > 0 ? Math.max(...transactions.map(obj => obj.ID)) + 1 : 1
    // create a new transaction object
    const newTransaction = {
      ID: nextId,
      ip_address: req.ip,
      timestamp: GoogleDate(Date.now()),
      ...req.body
    }
    // convert newTransaction to an array matching the headers
    const newTransactionArray = headers.map(key => newTransaction[key])

    // build google sheets request
    const request = {
      spreadsheetId: SPREADSHEET_ID,
      range: TRANSACTION_RANGE,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        "majorDimension": "ROWS",
        "values": [newTransactionArray]
      },
      auth: auth,
    };

    try {
      const response = (await sheets.spreadsheets.values.append(request));
      res.json({
        response: response.data,
        dataAdded: newTransaction
      })
    } catch (err) {
      res.json(err.response.data)
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
})

module.exports = router
