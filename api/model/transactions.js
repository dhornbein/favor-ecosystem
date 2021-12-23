const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const auth = require('./google-auth');

const SPREADSHEET_ID = env.SPREADSHEET_ID
const TRANSACTION_RANGE = 'Transactions!A:AA'

const REQUEST = {
  GET: {
    auth: auth,
    spreadsheetId: SPREADSHEET_ID,
    range: TRANSACTION_RANGE,
    valueRenderOption: 'UNFORMATTED_VALUE',
  },
  POST: {
    auth: auth,
    spreadsheetId: SPREADSHEET_ID,
    range: TRANSACTION_RANGE,}
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
  'brokerId',
  'ipAddress',
  'transactionPhone'
]

exports.get = async (params) => {
  try {
    const response = (await sheets.spreadsheets.values.get(REQUEST.GET)).data;
    return deserializeTransactions(response.values)
  } catch (err) {
    throw err
  }
}

exports.post = async (payload) => {
  try {
    const transactions = (await sheets.spreadsheets.values.get(REQUEST.GET)).data.values;
    let headers = [],
        nextId = 1;

    // collect the header row of the spreadsheet & find the next id
    if (transactions.length > 0) {
      headers = transactions[0];
      nextId = Math.max(...deserializeTransactions(transactions).map(obj => parseInt(obj.id))) + 1
      payload['id'] = nextId;
    }

    const payloadArray = headers.map(key => payload[key])

    const request = {
      ...REQUEST.POST,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        "majorDimension": "ROWS",
        "values": [payloadArray]
      },
    };

    const response = (await sheets.spreadsheets.values.append(request));
    return { 
      response, 
      payload,
      code: response.code ? response.code : 500,
      errors: response.data.error ? response.data.error : null
    }
  } catch (err) {
    throw new Error(err)
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