const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticateToken;
