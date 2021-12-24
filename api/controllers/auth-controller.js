const membersModel = require('../model/members-model')
const { error, success } = require('../middleware/validate')
const env = require('../env.json')
var jwt = require('jsonwebtoken');

exports.get = async (req, res, next) => {

  try {
    if (req.user) {
      res.status(200).json(success({
        user: req.user
      }, 'You are authenticated!'))
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

exports.post = async (req, res, next) => {
  try {
    let expiresIn = '1h'

    const token = jwt.sign({
      uuid: req.member.uuid,
      username: req.member.username,
      id: req.member.id,
      roles: req.member.roles.split(',')
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