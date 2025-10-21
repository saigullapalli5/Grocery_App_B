const models = require('../models/schema');
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await models.Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.submitFeedback = async (req, res) => {
    try {
        const feedback = new models.Feedback(req.body);
        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).send('Error submitting feedback');
    }
};
