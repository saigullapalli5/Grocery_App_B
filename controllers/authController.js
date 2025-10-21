const models = require("../models/schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (!username) return res.status(400).send("Username is required");

    const userExists = await models.Users.findOne({ username });
    if (userExists) return res.status(400).send("Username already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new models.Users({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    // Find user by email
    const user = await models.Users.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role || "user" },
      process.env.JWT_SECRET || "sai",
      { expiresIn: "1d" }
    );
   
    // Set token in HTTP-only cookie (cross-origin support for localhost:3000 -> 5100)
    res.cookie("userJwtToken", token, {
      httpOnly: true,
      secure: true, // required when SameSite=None
      sameSite: "none", // allow cross-site requests with credentials
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send user info in response
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstname: user.firstname,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// POST /api/auth/logout - Clear user auth cookie
exports.logoutUser = async (req, res) => {
  try {
    // Match attributes used when setting the cookie in loginUser
    const attrs = {
      httpOnly: true,
      secure: true, // cookie was set with secure:true
      sameSite: "none", // cookie was set with SameSite=None
      path: "/",
    };
    // Overwrite cookie with immediate expiry
    res.cookie("userJwtToken", "", { ...attrs, expires: new Date(0), maxAge: 0 });
    // Clear using same attributes
    res.clearCookie("userJwtToken", { ...attrs });
    return res.status(200).json({ message: "User logged out" });
  } catch (err) {
    console.error("Error in logoutUser:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
