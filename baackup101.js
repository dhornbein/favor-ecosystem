
var exec = require('child_process').exec;

var cors = require('cors')

var express = require('express');
var bodyParser = require('body-parser')

var app = express();
var admin = require("firebase-admin");
var functions = require("firebase-functions");
var serviceAccount = require("./serviceaccount.json");
const path = require('path');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const env = require('./env.json');

const SPREADSHEET_ID = env.SPREADSHEET_ID;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// parse application/json
app.use(cors());


const email = require('node-email-extractor').default;

const { appendToSheet } = require('./sheets');

async function updateSheet() {

  await admin.firestore()
    .collection('emails').orderBy('id', 'desc').limitToLast(1)
    .onCreate(async (snapshot, _) => {

      const id = snapshot

      const documentData = snapshot.data()
      const date = snapshot.id
      const emails = documentData[0]
    })

  await appendToSheet(id, emails)
}

async function getData(req) {
  var data = await email.url(req.body.url)
  // .then(result => {
  console.log(data.emails);
  // const obj = 'test';
  const emailData = data.emails
  const emailArray = []
  emailArray.push(data.emails)
  const saved = await db.collection('emails').doc('saved');
  saved.get().then((doc) => emailArray.push(doc.data().email))

  console.log(`current list: ${emailArray}`)
  var date = new Date().toDateString()
  console.log(date)
  await db.collection('emails').doc(`${date}`).set({ scraped: emailArray[0] })
    .then((emailArray) => {
      (async function fin() {

        await appendToSheet(new (Date).toLocaleString, [emailArray[0]])
      })
    })
  //  update({ email: 'test' }).then(() =>
  //         console.log(emailData));
  // });

  return Promise.resolve(emailArray);
}

async function getMoreData(data) {
  return Promise.resolve(data + 'more data');
}

async function getAll() {
  const data = await getData(req.body.url)
  return `All the data: data, moreData`;
}

// getAll().then((all) => {
//   console.log('all the data')
// })



app.get('/', function (req, res) {
  res.render('index');
});
// app.get('/emails', function (req, res) {
//   var url = req.body.url;

//   var cmd = 'node email.js ' + url;

//   exec(cmd, function (error, stdout, stderr) {

//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
//   });
// });


app.post('/emails', function (req, res) {
  (async () => {
    var data = await email.url(req.body.url)
    // .then(result => {
    console.log(data.emails);
    // const obj = 'test';
    const emailData = data.emails
    const emailArray = []

    emailArray.push(data.emails)
    await db.collection('emails').doc('saved').get()
      .then((doc) => emailArray.push(doc.data().email))

    console.log(`list: ${emailArray}`)
    var date = new Date().toDateString()
    console.log(date)
    await db.collection('emails').doc(`${date}`).set({ scraped: JSON.stringify(emailArray) })

    const auth = new google.auth.GoogleAuth({
      // generate your service_account.json
      keyFile: path.join(__dirname, 'serviceaccount.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    google.options({ auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'A1:A1',
      valueInputOption: 'USER_ENTERED',

      requestBody: {
        values: emailArray
      },
    });
    //  update({ email: 'test' }).then(() =>
    //         console.log(emailData));
    // });


  })()
})




var port = 80;
app.listen(port);
console.log('Listening on port ' + port + '.');
