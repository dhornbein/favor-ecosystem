const membersModel = require('../model/members-model')
const { v4: uuidv4 } = require('uuid')
const { error, success } = require('../middleware/validate')

exports.get = async (req, res, next) => {

  try {
    const members = await membersModel.get()
    let query = members

    if (req.query) {
      if (query && req.query.searchString) {
        let search = new RegExp(req.query.searchString, 'g')
        query = query.filter(mem => search.test( [mem.firstName,mem.lastName,mem.username,mem.brokerName].join(' ') ) )
      }
      if (query && req.query.searchId)
        query = query.filter(mem => mem.id == req.query.searchId)
      if (query && req.query.skip)
        query = query.slice(req.query.skip)
      if (query && req.query.limit)
        query = query.slice(0, req.query.limit)
    }

    if (query && query.length > 0) {
      res.status(200).json(success(query,{ query: req.query }))
    } else {
      res.status(404).json(error({
        title: "No Members Found",
        detail: "Your search turned up no results",
        status: 404,
        path: req.originalUrl,
        timestamp: new Date(),
      }))
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(error(err))
  }

}

exports.post = async (req, res, next) => {

  const authMember = req.user;

  // build new member object
  let newMember = {
    uid: uuidv4(),
    created: new Date().toISOString(),
    ...req.body
  }

  // TODO increment invited count for inviting member
  // if the inviting member isn't set, set it to the current broker
  if (authMember && !req.body.invitedByUid) newMember.invitedByUid = authMember.uid

  try {

    const { response, payload } = await membersModel.post(newMember)

    req.success = true
    
    res.status(201).json(success(payload, {msg: 'Member created successfully'}))

  } catch (err) {
    console.error('Controller Error', err)
    res.status(500).json(error(err))
  }
  next()
}

exports.put = async (req, res, next) => {
  try {
    const uid = req.params.uid

    const { response, payload } = await membersModel.put(uid, req.body)
    
    console.log('membersController.put',response.data,payload);
    res.status(200).json(success(payload, {msg: 'Member updated successfully'}))

  } catch (err) {
    console.error('Controller Error', err)
    res.status(500).json(error(err))
  }
  
}

exports.decodeInviteToken = async (req, res, next) => {
  const payload = req.body
  res.status(200).json(success( payload ))
}