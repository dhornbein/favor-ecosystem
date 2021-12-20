const { Router } = require('express')
const { query } = require('express-validator/check');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const auth = require('../auth');

const SPREADSHEET_ID = env.SPREADSHEET_ID
const TRANSACTION_RANGE = 'Transactions!A:N'

function GoogleDate(JSdate) {
  var D = new Date(JSdate);
  var Null = new Date(Date.UTC(1899, 11, 30, 0, 0, 0, 0)); // the starting value for Google
  return ((D.getTime() - Null.getTime()) / 60000 - D.getTimezoneOffset()) / 1440;
}

const router = Router()
let headers = null
let transactions = null
const numberFields = ['ID', 'payee_id', 'recipient_id', 'amount', 'fee']

google.options({ auth });

let test = sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: TRANSACTION_RANGE,
}, (err, result) => {
  if (err) {
    // Handle error
    console.log(err);
  } else {
    headers = result.data.values.shift()
    transactions = result.data.values.map(row => {
      return headers.reduce((obj, key, index) => {
        let value = numberFields.includes(key) ? parseFloat(row[index]) : row[index]
        return { ...obj, [key]: value }
      }, {})
    })
  }
})


router.get('/transactions', function (req, res) {

  res.json(transactions)

})

/* GET member by ID. */
router.get('/transactions/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  const transaction = transactions.filter(obj => (obj.payee_id === id || obj.recipient_id === id))
  if (transaction.length > 0) {
    res.json(transaction)
  } else {
    res.sendStatus(404)
  }
})

router.post('/transactions/create', async (req, res, next) => {
  // find the next id from the transactions array
  const nextId = transactions.length > 0 ? Math.max(...transactions.map(obj => obj.ID)) + 1 : 1
  // create a new transaction object
  const newTransaction = {
    ID: nextId,
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
})

module.exports = router
