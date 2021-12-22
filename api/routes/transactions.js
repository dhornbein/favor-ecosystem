const { Router } = require('express')
const transactionsController = require('../controllers/transactions')

const router = Router()

const use = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/transactions', use(transactionsController.get))
router.get('/transactions/:id', use(transactionsController.get))
router.post('/transactions', transactionsController.validation,use(transactionsController.post))

module.exports = router
