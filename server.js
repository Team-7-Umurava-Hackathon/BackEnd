import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { swaggerDocs } from "./src/config/swagger.js";



import auth from "./src/routes/auth.js";
import user from "./src/routes/user.js";
import jobs from "./src/routes/jobs.js";
import talents from "./src/routes/talents.js";
import ranking from "./src/routes/ranking.js";

console.log("ENV CHECK:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Recruiter Backend is running 🚀"
  });
});
swaggerDocs(app);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ai-recruiter")
  .then(() => console.log("MongoDB connected successfully ✅"))
  .catch((err) => console.error("MongoDB connection error ❌", err));


// Routes

app.use('/api/auth', auth);
// app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/jobs', jobs);
app.use('/api/talents', talents);
app.use('/api/ranking', ranking);

console.log("➡️ Loading user routes...");
app.use('/api/user', user);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  res.status(500).json({
    message: err.message || "Internal server error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});