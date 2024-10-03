const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes"); // Ensure the path is correct

// Load environment variables
dotenv.config();

// Debug logging to check if environment variables are loaded correctly
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);
console.log(
  "Environment loaded:",
  process.env.MONGO_URI !== undefined,
  process.env.PORT !== undefined
);

const app = express();
const port = process.env.PORT || 5000; // Default to 5000 if PORT is not defined

// Middleware
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/auth", authRoutes); // Prefix all auth routes with /api/auth

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
