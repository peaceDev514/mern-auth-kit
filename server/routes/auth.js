import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ========================= REGISTER =========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 3️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 4️⃣ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5️⃣ Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// ========================= LOGIN =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4️⃣ Create JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 5️⃣ Send success response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// ========================= GET CURRENT USER =========================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user is set by authMiddleware
    return res.status(200).json({
      message: "User authenticated",
      user: req.user,
    });
  } catch (err) {
    console.error("Error in /me route:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
