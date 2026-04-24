import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER RECRUITER
export const registerRecruiter = async (req, res) => {

    console.log("➡️ Registering recruiter with data:", req.body);   
  try {
    const { name, email, password, company } = req.body;
 
    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }
    console.log("✅ Input validated, no existing user found. Proceeding to create recruiter.");

    // 3. Create recruiter
    const user = await User.create({
      name,
      email,
      password,
      company,
      role: "recruiter"
    });
console.log("✅ Recruiter created successfully:", user);
    // 4. Generate token
    const token = generateToken(user);

    // 5. Response
    res.status(201).json({
      message: "Recruiter registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: 'Umurava'
      }
    });

  } catch (error) {
     return res.status(500).json({
      message: error.message
    });
  }
};