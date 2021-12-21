const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const auth = require('../auth');

const SPREADSHEET_ID = env.SPREADSHEET_ID
const TRANSACTION_RANGE = 'Transactions!A:AA'

const REQUEST = {
  auth: auth,
  spreadsheetId: SPREADSHEET_ID,
  range: TRANSACTION_RANGE,
  valueRenderOption: 'UNFORMATTED_VALUE',
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

exports.get = async (params) => {
  try {
    const response = (await sheets.spreadsheets.values.get(REQUEST)).data;
    console.log('response', params);
    return deserializeTransactions(response.values)
  } catch (err) {
    throw err
  }
}

// takes a 'ListValue' array from the MajorDimensions=ROWS sheet 
// with the first row being the headers
// returns an array of objects with the headers as keys
function deserializeTransactions(transactions) {
  let headers = transactions.shift(); // take the first row as headers
  return transactions.map(row => {
    return headers.reduce((obj, key, index) => {
      if (KEYS.includes(key)) return { ...obj, [key]: row[index] };
      return obj;
    }, {});

  });
}