const { Router } = require('express')
const membersController = require('../controllers/members-controller')
const authController = require('../controllers/auth-controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth-middleware')

const router = Router()

const use = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/members', auth.checkToken, use(membersController.get))
router.get('/members/:id', auth.checkToken, use(membersController.get))
router.post('/members', auth.requireToken, validate.isBroker, validate.member, use(membersController.post))
router.post('/members/join/:token', auth.requireInviteToken, validate.inviteToken, validate.member, use(membersController.post), use(authController.claimInvite))

module.exports = router