const { Router } = require('express')
const path = require('path');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const SPREADSHEET_ID = env.SPREADSHEET_ID;

var serviceAccount = require("../serviceaccount.json");

const router = Router()

// Test route
router.get('/transactions', function (req, res) {

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../serviceaccount.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

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
          obj[header[index]] = element
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
