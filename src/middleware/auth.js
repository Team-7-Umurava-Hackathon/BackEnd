import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request object
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: err.message });
  }
};

// Middleware to check if user is logged in AND is a specific role (optional)
export const verifyTokenAndRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Get token from Authorization header
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user has required role
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      // Attach user info to request object
      req.user = decoded;

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.status(500).json({ message: err.message });
    }
  };
};

// Optional: Get full user details from database
export const verifyTokenAndGetUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch full user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: err.message });
  }
};