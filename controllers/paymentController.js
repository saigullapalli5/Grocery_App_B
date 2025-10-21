const models = require("../models/schema");
exports.getPayments = async (req, res) => {
  try {
    const payments = await models.Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = new models.Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).send("Error creating payment");
  }
};

exports.getUserPayments = async (req, res) => {
  console.log(req.params)
  try {
    const { userId } = req.params;

    const payments = await models.Payment.find({user:userId} );
    if (!payments || payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this user" });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the product exists
    const product = await models.Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await models.Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};
