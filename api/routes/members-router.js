const { Router } = require('express')
const membersController = require('../controllers/members-controller')
const authController = require('../controllers/auth-controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth-middleware')

const router = Router()

const use = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @api {get} /members Get all members
 */
router.get('/members', auth.checkToken, use(membersController.get))
/**
 * @api {post} /members Create a member
 */
router.post('/members', auth.requireToken, validate.isBroker, validate.member, use(membersController.post))
/**
 * @api {get} /members/join/:token decode invitation token and return token data
 */
router.get('/members/join/:token', auth.requireInviteToken, validate.inviteToken, use(membersController.decodeInviteToken))
/**
 * @api {post} /members/join/:token trades in a invitation token and creates a new member
 */
router.post('/members/join/:token', auth.requireInviteToken, validate.inviteToken, validate.member, use(membersController.post), use(authController.claimInvite))
/**
 * @api {patch} /members/:id Update a member
 */
router.patch('/members/:uid', auth.requireToken, validate.isSelfOrBroker, validate.memberUpdate, use(membersController.put))

module.exports = router