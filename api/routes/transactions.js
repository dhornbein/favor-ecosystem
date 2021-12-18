const { Router } = require('express')
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const SPREADSHEET_ID = env.SPREADSHEET_ID;
const auth = require('../auth');

const router = Router()
let headers = null
let transactions = null
const numberFields = ['ID', 'payee_id', 'recipient_id', 'amount', 'fee']

google.options({ auth });

let test = sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: 'transactions!A:N',
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

module.exports = router
