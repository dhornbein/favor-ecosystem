const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = auth