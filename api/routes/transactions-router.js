const { Router } = require('express')
const transactionsController = require('../controllers/transactions-controller')
const validate = require('../middleware/validate')
const auth = require('../middleware/auth-middleware')

const router = Router()

const use = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @api {get} /transactions Get all transactions
 */
router.get('/transactions', auth.checkToken, use(transactionsController.get))
/**
 * @api {post} /transactions Create a transaction
 */
router.post('/transactions', auth.requireToken, validate.transaction, use(transactionsController.post))

module.exports = router
