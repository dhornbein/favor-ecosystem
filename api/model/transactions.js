const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const auth = require('../auth');

const request = {
  spreadsheetId: SPREADSHEET_ID,
  range: TRANSACTION_RANGE,
  auth: auth
}

const KEYS = [
  'uuid',
  'id',
  'created',
  'updated',
  'payeeId',
  'recipientId',
  'amount',
  'title',
  'description',
  'effectiveDatetime',
  'brokerId'
]

exports.get = async () => {
  try {
    const response = (await sheets.spreadsheets.values.get(request)).data;
    let headers = response.values.shift();
    let transactions = response.values.map(row => {
      return headers.reduce((obj, key, index) => {
        let value = numberFields.includes(key) ? parseFloat(row[index]) : row[index];
        return { ...obj, [key]: value };
      }, {});
    });
    return { transactions, headers }
  } catch (err) {
    throw err
  }
}
