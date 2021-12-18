const { Router } = require('express')
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const SPREADSHEET_ID = env.SPREADSHEET_ID;
const auth = require('../auth');

const router = Router()
let headers = null
let transactions = null
const numberFields = ['ID', 'credit_limit', 'balance', 'credit', 'debit', 'transaction_total']

google.options({ auth });

sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: 'transactions!A:N',
}, (err, result) => {
  if (err) {
    // Handle error
    console.log(err);
  } else {
    headers = result.data.values.shift()
    console.log(result.data.values);
    transactions = result.data.values.map(row => {
      let obj = {}
      row.forEach((element, index) => {
        obj[headers[index]] = numberFields.includes(headers[index]) ? parseFloat(element) : element
      })
      return obj
    })
  }
})

router.get('/transactions', function (req, res) {

  res.json({
    header: headers,
    data: transactions
  })

})

module.exports = router
