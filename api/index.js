var exec = require('child_process').exec;
var cors = require('cors')
var express = require('express');

var app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());



// Require API routes
const members = require('./routes/members')
const transactions = require('./routes/transactions')

// Import API Routes
app.use(members)
app.use(test)
app.use(transactions)

module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
