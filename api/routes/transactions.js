const { Router } = require('express')
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const SPREADSHEET_ID = env.SPREADSHEET_ID;
const auth = require('../auth');

const router = Router()
const numberFields = ['ID', 'credit_limit', 'balance', 'credit', 'debit', 'transaction_total']

// Test route
router.get('/transactions', function (req, res) {

  google.options({ auth });

  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'transactions!A:N',
  }, (err, result) => {
    if (err) {
      // Handle error
      console.log(err);
    } else {
      let header = result.data.values.shift()
      let data = result.data.values.map(row => {
        let obj = {}
        row.forEach((element, index) => {
          obj[header[index]] = numberFields.includes(header[index]) ? parseFloat(element) : element
        })
        return obj
      })

      res.json({ 
        header: header,
        data: data
      })
    }
  })

})

module.exports = router
