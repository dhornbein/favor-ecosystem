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
const users = require('./routes/members')
const test = require('./routes/test')

// Import API Routes
app.use(users)
app.use(test)


async function getData(req) {
  var data = await email.url(req.body.sender)

    .then((emailArray) => {
      (async function fin() {


        await appendToSheet(new (Date).toLocaleString, data)

      })
    })
}

module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
