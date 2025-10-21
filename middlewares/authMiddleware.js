


// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.userJwtToken;
  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};









const adminAuthMiddleware = (req, res, next) => {
  const token = req.cookies.adminJwtToken; // cookie name must match frontend

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    req.user = decoded; // store decoded payload
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};



// ✅ Export both
module.exports = {
  authMiddleware,
  adminAuthMiddleware
};






