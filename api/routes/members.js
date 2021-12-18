const { Router } = require('express')
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const SPREADSHEET_ID = env.SPREADSHEET_ID;
const auth = require('../auth');

const router = Router()
let members = null
const numberFields = ['ID', 'credit_limit', 'balance', 'credit', 'debit', 'transaction_total']

google.options({ auth });

sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: 'members!A:M',
}, (err, result) => {
  if (err) {
    // Handle error
    console.log(err);
  } else {
    headers = result.data.values.shift()
    members = result.data.values.map(row => {
      return headers.reduce((obj, key, index) => {
        let value = numberFields.includes(key) ? parseFloat(row[index]) : row[index]
        return { ...obj, [key]: value }
      }, {})
    })
  }
})


/* GET member listing. */
router.get('/members', function (req, res, next) {
  res.json(members)
})

/* GET member by ID. */
router.get('/members/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  const member = members.find(member => parseInt(member.ID) === id)
  if (member) {
    res.json(member)
  } else {
    res.sendStatus(404)
  }
})

module.exports = router
