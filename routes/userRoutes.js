const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

// All routes are protected
router.get("/:id", auth.authMiddleware,  userController.getUserById);
router.put("/:id", auth.authMiddleware, userController.updateUser);
router.delete("/:id", auth.adminAuthMiddleware,  userController.deleteUser);

module.exports = router;
