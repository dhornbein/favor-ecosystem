const membersModel = require('../model/members-model')
const { error, success } = require('../middleware/validate')
const env = require('../env.json')
var jwt = require('jsonwebtoken');

exports.get = async (req, res, next) => {

  try {
    const members = await membersModel.get(req.params)
  } catch (err) {
    console.error(err)
    res.status(500).json(error(err))
  }

}

exports.post = async (req, res, next) => {
  try {
    let expiresIn = '1h'

    const token = jwt.sign({
      username: req.member.username,
      roles: req.member.roles
    }, env.JWT_AUTH_SECRET, {
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