const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const auth = require('./google-auth');

const SPREADSHEET_ID = env.SPREADSHEET_ID
const INVITE_RANGE = 'invitations!A:AA'
const INVITE_HEADER_RANGE = 'invitations!1:1'

const REQUEST = {
  GET: {
    auth: auth,
    spreadsheetId: SPREADSHEET_ID,
    range: INVITE_RANGE,
    valueRenderOption: 'UNFORMATTED_VALUE',
  },
  GET_HEADERS: {
    auth: auth,
    spreadsheetId: SPREADSHEET_ID,
    range: INVITE_HEADER_RANGE,
    valueRenderOption: 'UNFORMATTED_VALUE',
  },
  POST: {
    auth: auth,
    spreadsheetId: SPREADSHEET_ID,
    range: INVITE_RANGE,
  }
}

const KEYS = [
  'created',
  'firstName',
  'lastName',
  'email',
  'phone',
  'favor',
  'invitedById',
  'invitedBy',
  'claimed',
  'token',
]

exports.post = async (payload) => {
  try {

    // grab the spreadsheet headers
    const headers = (await sheets.spreadsheets.values.get(REQUEST.GET_HEADERS)).data.values[0];

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