

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require("../middlewares/authMiddleware");
router.get('/allCategories', auth.authMiddleware, categoryController.getAllCategories);
// Admin-only variant
router.get('/admin/allCategories', auth.adminAuthMiddleware, categoryController.getAllCategories);
// Create category should be admin-only
router.post('/createCategory', auth.authMiddleware, categoryController.createCategory);


module.exports = router;



