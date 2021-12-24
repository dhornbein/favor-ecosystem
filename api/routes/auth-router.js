const { Router } = require('express')
const authController = require('../controllers/auth-controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth-middleware')

const router = Router()

const use = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/auth', auth, use(authController.get))
router.post('/auth', validate.auth, use(authController.post))

module.exports = router