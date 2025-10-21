const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models/schema");

exports.registerAdmin = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (!username) return res.status(400).send("Username is required");

    const userExists = await models.Admins.findOne({ username });
    if (userExists) return res.status(400).send("Username already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new models.Admins({
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



exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find admin by email
    const admin = await models.Admins.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // 2. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("object");
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT token with admin role
    const token = jwt.sign(
      { adminId: admin._id, role: admin.role || "admin" },
      process.env.JWT_SECRET_ADMIN || "mysecretkey",
      { expiresIn: "1d" }
    );

    res.cookie("adminJwtToken", token, {
      httpOnly: true,
      secure: true, // required when SameSite=None
      sameSite: "none", // allow cross-site requests with credentials
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });


    

    // 5. Send safe admin info to frontend
    res.status(200).json({
      message: "Admin login successful",
      admin: {
        _id: admin._id,
        firstname: admin.firstname,
        email: admin.email,
        role: admin.role || "admin",
      },
    });
  } catch (err) {
    console.error("Error in loginAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await models.Users.find();
    res.send(users);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.deleteUser = (req, res) => {
  let id = req.params.id;
  models.Users.deleteOne({ _id: id })
    .then((user) => res.status(200).json(user))
    .catch(() => res.sendStatus(500));
};

// POST /api/admin/logout - Clear admin auth cookie
exports.logoutAdmin = async (req, res) => {
  try {
    // Match attributes used when setting the cookie in loginAdmin
    const attrs = {
      httpOnly: true,
      secure: true, // cookie was set with secure:true
      sameSite: "none", // cookie was set with SameSite=None
      path: "/",
    };
    // Overwrite cookie with immediate expiry (defensive)
    res.cookie("adminJwtToken", "", { ...attrs, expires: new Date(0), maxAge: 0 });
    // And clear the cookie using the same attributes
    res.clearCookie("adminJwtToken", { ...attrs });
    return res.status(200).json({ message: "Admin logged out" });
  } catch (err) {
    console.error("Error in logoutAdmin:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
