const { Router } = require('express')
const membersController = require('../controllers/members-controller')
const authController = require('../controllers/auth-controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth-middleware')

const router = Router()

const use = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/members', auth.checkToken, use(membersController.get))
router.post('/members', auth.requireToken, validate.isBroker, validate.member, use(membersController.post))
router.get('/members/join/:token', auth.requireInviteToken, validate.inviteToken, use(membersController.decodeInviteToken))
router.post('/members/join/:token', auth.requireInviteToken, validate.inviteToken, validate.member, use(membersController.post), use(authController.claimInvite))
router.patch('/members/update/:uid', auth.requireToken, validate.memberUpdate, use(membersController.put))

module.exports = router