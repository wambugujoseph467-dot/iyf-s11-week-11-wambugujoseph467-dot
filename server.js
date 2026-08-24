const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");
const postRoutes = require("./src/routes/postRoutes");
const authRoutes = require("./src/routes/auth");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Week 11 MongoDB API is running",
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});