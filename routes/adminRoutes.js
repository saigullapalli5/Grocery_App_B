const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth= require("../middlewares/authMiddleware");

router.post("/register", adminController.registerAdmin);
router.post("/login",  adminController.loginAdmin);
router.post("/logout",  adminController.logoutAdmin);
router.get("/getAllUsers", auth.adminAuthMiddleware, adminController.getAllUsers);
router.delete("/:id",auth.adminAuthMiddleware, adminController.deleteUser);


// ✅ Admin dashboard auth check
router.get("/dashboard", auth.adminAuthMiddleware, (req, res) => {
  res.json({ success: true, message: "Admin authenticated" });
});

module.exports = router;



