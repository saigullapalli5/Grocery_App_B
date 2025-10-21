const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/createPayment', paymentController.createPayment);
router.get('/getPayments', paymentController.getPayments);
router.get('/:userId', paymentController.getUserPayments);

module.exports = router;



