const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const auth = require('./google-auth');

const SPREADSHEET_ID = env.SPREADSHEET_ID
const SHEET = 'invitations'
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
  'revoked',
  'token',
]

exports.getInvites = async (format = true) => {
  try {
    const response = (await sheets.spreadsheets.values.get(REQUEST.GET)).data;
    return format ? deserializeInvites(response.values, KEYS) : response.values
  } catch (err) {
    throw err
  }
}

exports.postClaimInvite = async (token) => {
  
  const invites = await this.getInvites(false)
  const col = columnToLetter(invites[0].indexOf('claimed') + 1)
  let row

  // invites is a 2D array, loop through and find the token
  invites.find((invite, index) => invite.includes(token) && (row = index + 1))

  const range = SHEET + '!' + col + row

  try {
    const response = sheets.spreadsheets.values.update({
      ...REQUEST.POST,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        "values": [['TRUE']]
      },
    })
    console.log('postClaimInvite',response)

    return response

  } catch (err) {
    throw new Error(err)
  }
}

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

// takes a 'ListValue' array from the MajorDimensions=ROWS sheet 
// with the first row being the headers
// returns an array of objects with the headers as keys
function deserializeInvites(invite, keys) {
  let headers = invite.shift(); // take the first row as headers
  return invite.map(row => {
    return headers.reduce((obj, key, index) => {
      if (keys.includes(key)) return { ...obj, [key]: row[index] };
      return obj;
    }, {});

  });
}

function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}