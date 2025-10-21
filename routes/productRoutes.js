const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middlewares/authMiddleware");

router.post("/createProduct",auth.adminAuthMiddleware, productController.createProduct);
router.get("/getAllProducts",auth.authMiddleware, productController.getAllProducts);
// Admin-only variant for dashboards/lists
router.get("/admin/getAllProducts", auth.adminAuthMiddleware, productController.getAllProducts);
// Admin-only variant to fetch product by id (must be before generic param route)
router.get("/admin/:id", auth.adminAuthMiddleware, productController.getProductById);
router.get("/:id", auth.authMiddleware, productController.getProductById);
// Admin-only updates and deletes
router.put("/:id", auth.adminAuthMiddleware, productController.updateProduct);
router.delete("/:id", auth.adminAuthMiddleware, productController.deleteProduct);
// Admin path variants (optional)
router.put("/admin/:id", auth.adminAuthMiddleware, productController.updateProduct);
router.delete("/admin/:id", auth.adminAuthMiddleware, productController.deleteProduct);

router.get('/products/:id/image', productController.getProductImageById);
module.exports = router;
