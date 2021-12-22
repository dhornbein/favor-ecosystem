const members = require('../model/members')
const { v4: uuidv4 } = require('uuid')
const { error, success } = require('../utilities/index')

exports.get = async (req, res, next) => {

  try {
    const trans = await members.get(req.params)

    if (req.params.id) {
      const found = trans.find(row => row.id === parseInt(req.params.id))

      if (found) {
        res.status(200).json({ data: found })
      } else {
        res.status(404).json(error({
          title: "Member Not Found",
          detail: "No members found with that ID",
          status: 404,
          path: req.originalUrl,
          timestamp: new Date(),
        }))
      }
    } else {
      res.status(200).json({ data: trans })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(error(err))
  }

}

exports.post = async (req, res, next) => {
  try {
    // build new member object
    const newMember = {
      uuid: uuidv4(),
      created: new Date().toISOString(),
      ...req.body
    }

    // validate new transaction object

    const { response, payload, errors, code } = await members.post(newMember)
    if (!errors) {
      res.status(201).json(success({
        message: `Member created successfully`,
        data: payload,
      }))

    } else {
      console.log('Member Post Error', response);
      res.status(code).json(error({
        title: "Member Creation Failed",
        detail: "Something went wrong applying the member to the database",
        status: code,
        path: req.originalUrl,
        timestamp: new Date(),
        errors: errors
      }))
    }

  } catch (err) {
    console.error('Controller Error', err)
    res.status(500).json(error(err))
  }
}