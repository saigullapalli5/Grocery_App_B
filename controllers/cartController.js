const models = require('../models/schema');


exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await models.AddToCart.find();
    res.json(cartItems);
  } catch (error) {
    res.status(500).send('Server error');
  }
};


// PATCH /api/cart/:id - Update quantity for a cart item
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    let { quantity } = req.body;
    quantity = Number(quantity);
    if (!Number.isFinite(quantity)) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    if (quantity < 1) quantity = 1;

    const updated = await models.AddToCart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return res.status(500).json({ error: 'Failed to update cart item quantity' });
  }
};


// GET /api/cart/user/:userId - Get all cart items for a user
exports.getCartItemsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await models.AddToCart.find({ userId });
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items by user:', error);
    return res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};


// GET /api/cart/:id - Get a single cart item by its id
exports.getCartItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await models.AddToCart.findById(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    return res.status(200).json(cartItem);
  } catch (error) {
    console.error('Error fetching cart item by id:', error);
    return res.status(500).json({ error: 'Failed to fetch cart item' });
  }
};




exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1, productname, price, image } = req.body;

    const item = new models.AddToCart({
      userId,
      productId,
      quantity,
      productname,
      price,
      image
    });  

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send("Error adding to cart");
  }
};




// DELETE /api/cart/:id - Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    const removedItem = await models.AddToCart.findByIdAndDelete(cartItemId);

    if (!removedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};
