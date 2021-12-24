const { Router } = require('express')
const membersController = require('../controllers/members-controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth-middleware')

const router = Router()

const use = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/members', use(membersController.get))
router.get('/members/:id', use(membersController.get))
router.post('/members', auth, validate.member, use(membersController.post))

module.exports = router