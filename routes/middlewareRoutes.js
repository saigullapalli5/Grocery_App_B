
const express = require("express");
const router = express.Router();
const token = require("../middlewares/authMiddleware");

// Verify route
router.get("/adminVerify", token.adminAuthMiddleware, (req, res) => {
  res.json({ success: true, message: "Admin verified", admin: req.admin });
});

router.get("/userVerify", token.authMiddleware, (req, res) => {
  res.json({ success: true, message: "User verified", user: req.user });
});


module.exports = router;

