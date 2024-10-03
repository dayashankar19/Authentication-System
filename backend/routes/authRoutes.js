const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //Salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ username, email, hashedPassword });
    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with token
    res.status(201).json({
      message: `Successfully registered ${username}`,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(400).json({ error: "Incorrect credentials" });

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Dashboard Route (Protected)
router.get("/dashboard", authenticateToken, async (req, res) => {
  res.json({ message: `Welcome to your Dashboard, ${req.user.username}!` });
});

// Request password reset route

router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    //Create a reset token using JWT
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //Send email with the reset link
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `Click this link to reset your password: ${resetURL}`,
    });
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Password reset error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Reset password route
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log("Token:", token); // Log the token
  console.log("Password:", password); // Log the password

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ error: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Fix hash logic

    user.password = hashedPassword; // Save hashed password
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
