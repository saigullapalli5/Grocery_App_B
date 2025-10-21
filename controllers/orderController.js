const models = require("../models/schema");
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await models.Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).send("Server error");
  }
};



// POST /api/orders/createFromCart - Create ONE consolidated order for all items in user's cart
exports.createOrdersFromCart = async (req, res) => {
  try {
    const { firstname, lastname, userId, phone, paymentMethod, address } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    // Fetch all cart items for the user
    const cartItems = await models.AddToCart.find({ userId });
    if (!cartItems.length) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // Compute consolidated totals
    const totalItems = cartItems.reduce((sum, ci) => sum + Number(ci.quantity || 1), 0);
    const totalPrice = cartItems.reduce(
      (sum, ci) => sum + Number(ci.price || 0) * Number(ci.quantity || 1),
      0
    );

    // Build a consolidated order using existing schema fields
    const consolidatedOrder = await models.Order.create({
      firstname,
      lastname,
      userId,
      phone,
      productId: cartItems[0].productId, // placeholder; schema requires a string
      productname: `Cart Order (${totalItems} items)`,
      quantity: String(totalItems),
      price: String(totalPrice),
      paymentMethod,
      address,
    });

    // Clear user's cart after successful order creation
    await models.AddToCart.deleteMany({ userId });

    return res.status(201).json({
      msg: "Consolidated order created from cart",
      order: consolidatedOrder,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Error creating orders from cart:", error);
    return res.status(500).json({ msg: "Failed to place orders from cart" });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      userId,
      phone,
      productId,
      productname,
      quantity,
      price,
      paymentMethod,
      address,
    } = req.body;

  

    // ✅ Create the new order
    const newOrder = await models.Order.create({
      firstname,
      lastname,
      userId,
      phone,
      productId,
      productname,
      quantity,
      price,
      paymentMethod,
      address,
    });

    return res.status(201).json({
      msg: "Order successfully created",
      newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ msg: "Error placing your order" });
  }
};

// GET /api/orders/:userId - Get all orders by a specific user
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await models.Order.find({ userId });
    // Always return 200 with an array (possibly empty) so clients can render an empty state
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user:", error);
    return res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// DELETE /api/orders/:id - Cancel an order by ID
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await models.Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};



exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await models.Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};


