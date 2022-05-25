const { Router } = require('express')
const authController = require('../controllers/auth-controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth-middleware')

const router = Router()

const use = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @api {get} /auth checks if user's auth token is valid
 */
router.get('/auth', auth.checkToken, use(authController.get))
/**
 * @api {post} /auth/ login user
 */
router.post('/auth', validate.auth, use(authController.post))
/**
 * @api {get} /auth/me get authenticated user information
 */
router.get('/auth/me', auth.requireToken, use(authController.getMember))
/**
 * @api {post} /auth/invite allows authenticated user to create an invitation token
 */
router.post('/auth/invite', auth.requireToken, validate.invite, use(authController.invite))

module.exports = router