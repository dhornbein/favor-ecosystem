const transactions = require('../model/transactions-model')
const { v4: uuidv4 } = require('uuid')
const { error, success } = require('../middleware/validate')
const { query } = require('express')

exports.get = async (req, res, next) => {

  try {
    const trans = await transactions.get(req.params)
    let query = trans

    if (req.query) {
      if (query && req.query.searchString) {
        let search = new RegExp(req.query.searchString, 'g')
        query = query.filter(tran => search.test( [tran.title, tran.description, tran.payee, tran.recipient].join(' ') ) )
      }
      if (query && req.query.payeeUid)
        query = query.filter(tran => tran.payeeUid == req.query.payeeUid)
      if (query && req.query.searchPayee)
        query = query.filter(tran => tran.payee.toLowerCase() === req.query.searchPayee.toLowerCase())
      if (query && req.query.recipientUid)
        query = query.filter(tran => tran.recipientUid == req.query.recipientUid)
      if (query && req.query.searchRecipient)
        query = query.filter(tran => tran.recipient.toLowerCase() === req.query.searchRecipient.toLowerCase())
      if (query && req.query.skip)
        query = query.slice(req.query.skip)
      if (query && req.query.limit)
        query = query.slice(0, req.query.limit)
    }

    if (query && query.length > 0) {
      res.status(200).json(success(query, { query: req.query }))
    } else {
      res.status(404).json(error({
        title: "No Transaction Found",
        detail: "Your search turned up no results",
        status: 404,
        path: req.originalUrl,
        timestamp: new Date(),
      }))
    }
  } catch(err) {
    console.error(err)
    res.status(500).json(error(err))
  }
  
}

exports.post = async (req, res, next) => {

  const authMember = req.user;
  // TODO better role validation
  const isBroker = authMember.roles && authMember.roles['broker']

  if (!isBroker && req.body.payeeUid !== authMember.uid) {
    res.status(403).json(error({
      title: "Not Authorized",
      detail: `You do not have permission to create transactions for anyone other than yourself!`,
      status: 403,
      path: req.originalUrl,
      timestamp: new Date(),
    }))
    return null
  }

  if (isBroker) {
    // if no brokerUid is set, set it to the current broker
    if (!req.body.brokerUid) req.body.brokerUid = authMember.uid
  }
    
  try {
    const { response, payload } = await transactions.post(req.body)
    
    res.status(201).json(success(payload, {msg: 'Transaction created successfully'}))

  } catch(err) {
    console.error('Controller',err)
    res.status(500).json(error(err))
  }
}