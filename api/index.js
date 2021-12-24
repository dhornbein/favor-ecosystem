var exec = require('child_process').exec;
var cors = require('cors')
var express = require('express');

var app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());



// Require API routes
const members = require('./routes/members-router')
const transactions = require('./routes/transactions-router')
const auth = require('./routes/auth-router')

// Import API Routes
app.use(members)
app.use(transactions)
app.use(auth)

module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
