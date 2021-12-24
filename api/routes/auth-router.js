const { Router } = require('express')
const authController = require('../controllers/auth-controller')
const validate = require('../middleware/validate')

const router = Router()

const use = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/auth', validate.auth, use(authController.post))

module.exports = router