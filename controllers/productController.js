const models = require("../models/schema");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await models.Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await models.Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error while fetching product" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      productname,
      price,
      description,
      category,
      image,
      countInStock,
      rating,
      dateCreated,
    } = req.body;
    const newProduct = new models.Product({
      productname,
      price,
      description,
      category,
      image,
      countInStock,
      rating,
      dateCreated,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send("Error creating product");
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find product by ID and update
    const updatedProduct = await models.Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // return the updated document
        runValidators: true, // validate before updating
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

// DELETE /api/products/:id
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

// GET /api/products/:id/image
exports.getProductImageById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await models.Product.findById(productId).select("image");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ image: product.image });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
