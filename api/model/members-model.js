const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('../env.json');
const auth = require('./google-auth');

const SPREADSHEET_ID = env.SPREADSHEET_ID
const MEMBERS_RANGE = 'members!A:AA'

const REQUEST = {
  GET: {
    auth: auth,
    spreadsheetId: SPREADSHEET_ID,
    range: MEMBERS_RANGE,
    valueRenderOption: 'UNFORMATTED_VALUE',
  },
  POST: {
    auth: auth,
    spreadsheetId: SPREADSHEET_ID,
    range: MEMBERS_RANGE,
  }
}

const KEYS = [
  'uuid',
  'id',
  'created',
  'updated',
  'username',
  'firstName',
  'lastName',
  'creditLimit',
  'balance',
  'credit',
  'debit',
  'transactionTotal',
  'brokerName',
  'brokerId',
  'invitedById',
  'phone',
  'email',
  'roles',
  'invites'
]

const FAVOR_KEYS = [
  'creditLimit',
  'balance',
  'credit',
  'debit',
  'transactionTotal',
]

// TODO handle returned keys better, offer option to get all keys, restrict keys based on user role
const AUTH_KEYS = [
  'id',
  'uuid',
  'username',
  'password',
  'roles'
]

exports.get = async (params) => {
  try {
    const response = (await sheets.spreadsheets.values.get(REQUEST.GET)).data;
    return deserializeMembers(response.values,KEYS)
  } catch (err) {
    throw err
  }
}

exports.auth = async () => {
  try {
    const response = (await sheets.spreadsheets.values.get(REQUEST.GET)).data;
    return deserializeMembers(response.values,AUTH_KEYS)
  } catch (err) {
    throw err
  }
}

exports.post = async (payload) => {
  try {
    const members = (await sheets.spreadsheets.values.get(REQUEST.GET)).data.values;
    let headers = [],
        nextId = 1;

    // collect the header row of the spreadsheet & find the next id
    if (members.length > 0) {
      headers = members[0];
      nextId = Math.max(...deserializeMembers(members, KEYS).map(obj => parseInt(obj.id))) + 1
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
function deserializeMembers(members,keys) {
  let headers = members.shift(); // take the first row as headers
  return members.map(row => {
    return headers.reduce((obj, key, index) => {
      row[index] = FAVOR_KEYS.includes(key) ? roundFavorAmount(row[index]) : row[index];
      if (key === 'roles' && row[index]) row[index] = row[index].split(',');
      if (keys.includes(key)) return { ...obj, [key]: row[index] };
      return obj;
    }, {});

  });
}

function roundFavorAmount(amount) {
  return Math.round(amount * 1000) / 1000;
}