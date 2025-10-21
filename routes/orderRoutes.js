const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require("../middlewares/authMiddleware");
router.post('/createOrder',auth.authMiddleware, orderController.createOrder);
// Create orders for all items in a user's cart
router.post('/createFromCart', auth.authMiddleware, orderController.createOrdersFromCart);
router.get('/getAllOrders',auth.adminAuthMiddleware, orderController.getAllOrders);
// Admin-only variant to fetch orders by user (must be before generic param route)
router.get('/admin/:userId', auth.adminAuthMiddleware, orderController.getOrdersByUser);
router.get('/:userId',auth.authMiddleware, orderController.getOrdersByUser);
router.put('/:id', auth.adminAuthMiddleware, orderController.updateOrderStatus);
router.delete('/:id',auth.adminAuthMiddleware, orderController.cancelOrder);

module.exports = router;


