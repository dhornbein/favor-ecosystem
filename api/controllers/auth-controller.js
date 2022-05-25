const membersModel = require('../model/members-model')
const authModel = require('../model/auth-model')
const { error, success } = require('../middleware/validate')
var jwt = require('jsonwebtoken');

/**
 * Checks if the request user is present
 * It will be validated at this point, if it is present
 * we can assume it is authenticated
 */
exports.get = async (req, res, next) => {

  try {
    if (req.user) {
      res.status(200).json(success({
        user: req.user
      }, {msg: 'You are authenticated!'}))
    } else {
      res.status(401).json(error({
        title: 'Not Authorized',
        detail: 'You are not authenticated',
      }))
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(error(err))
  }

}

/**
 * Searches member list for a member with the given UUID
 */
exports.getMember = async (req, res, next) => {

  try {
    const members = await membersModel.get()
    const member = members.find(member => member.uid === req.user.uid)
    res.status(200).json(success(member,{msg: 'Member info found'}))
  } catch (err) {
    console.error(err)
    res.status(500).json(error(err))
  }

}

/**
 * Claims invitation
 * if there is a token and a new member has been created in the request
 * take the new member UID and token to update the invitation in the database
 */
exports.claimInvite = async (req, res, next) => {
  const token = req.params.token
  
  if (!token || !req.newMember) return next() // no token or no newMember, nothing to claim
  
  const newUserUid = req.newMember.uid
 
  try {

    const response = await authModel.postClaimInvite(token, newUserUid)
    if (response.status != 200) {
      console.error('Issue claiming update',response)
    }
    
  } catch (err) {
    console.error('authController.claimInvite',err)
  }
}

/**
 * Creates new invitation
 */
exports.invite = async (req, res, next) => {
  try {
    let expiresIn = '2m'

    // invitation_token
    const token = jwt.sign({
      invitation: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
      },
      invitedByUid: req.body.invitedByUid,
      // TODO: add feature to accept a favor amount to attach to the invitation
      transaction: (req.body.favor) ? {
        payeeUid: req.body.invitedByUid,
        amount: req.body.favor,
      } : false,
    }, process.env.JWT_INVITE_SECRET, {
      expiresIn
    })

    // db payload
    const payload = {
      created: new Date().toISOString(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      favor: req.body.favor,
      invitedByUid: req.body.invitedByUid,
      token: token
    }

    // send token to database
    await authModel.post(payload)

    res.status(201).json(success({
      invitation_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn,
    }))
    
  } catch (err) {
    console.error('Controller Error', err)
    res.status(500).json(error(err))
  }
}

/**
 * creates auth token for user
 */
exports.post = async (req, res, next) => {
  try {
    let expiresIn = '14d'

    // access_token
    const token = jwt.sign({
      uid: req.member.uid,
      username: req.member.username,
      id: req.member.id,
      roles: req.member.roles //TODO turn this into an array?
    }, process.env.JWT_AUTH_SECRET, {
      expiresIn
    })

    res.status(201).json(success({
      access_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn,
    }))

  } catch (err) {
    console.error('Controller Error', err)
    res.status(500).json(error(err))
  }
}