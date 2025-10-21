const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/submitFeedback', feedbackController.submitFeedback);
router.get('/getFeedback', feedbackController.getAllFeedbacks);

module.exports = router;
