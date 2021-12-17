var exec = require('child_process').exec;

var cors = require('cors')

var express = require('express');
var bodyParser = require('body-parser')

var app = express();
// var admin = require("firebase-admin");
// var functions = require("firebase-functions");
var serviceAccount = require("../serviceaccount.json");
const path = require('path');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(cors());
const SPREADSHEET_ID = env.SPREADSHEET_ID;

const { appendToSheet } = require('./sheets');


// Require API routes
const members = require('./routes/members')
const test = require('./routes/test')
const transactions = require('./routes/transactions')

// Import API Routes
app.use(members)
app.use(test)
app.use(transactions)


app.get('/stats', function (req, res) {

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'serviceaccount.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  google.options({ auth });

  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'transactions!A:N',
  }, (err, result) => {
    if (err) {
      // Handle error
      console.log('there was an error');
      console.log(err);
    } else {
      res.json({ data: result.data})
    }

  })

})

module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
