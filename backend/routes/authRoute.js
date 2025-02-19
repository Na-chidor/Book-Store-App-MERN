import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",  // Explicitly set the SMTP host
  port: 587,               // Use 587 for TLS (recommended)
  secure: false,           // Set to false for TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer Error:", error);
  } else {
    console.log("Email Server is Ready!");
  }
});

// transporter.sendMail({
//   from: process.env.EMAIL_USER,
//   to: "nahomb145@gmail.com",
//   subject: "Test Email",
//   text: "This is a test email from my Node.js app.",
// }, (error, info) => {
//   if (error) {
//     console.error("Test Email Error:", error);
//   } else {
//     console.log("Test Email Sent:", info.response);
//   }
// });
router.post("/register", async (req, res) => {
  console.log("🚀 Incoming request to /register");

  const { name, email, password } = req.body;
  console.log("🔹 Received Data:", { name, email });

  try {
    console.log("🔎 Checking if user exists...");

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("🟡 User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("📦 Creating new user...");
    const newUser = new User({ name, email, password: hashedPassword, isVerified: false });
    await newUser.save();
    console.log("✅ User successfully created:", email);

    console.log("🔑 Generating email verification token...");
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const confirmationLink = `https://book-store-app-mern-api.vercel.app/auth/confirm/${token}`;
    console.log("📩 Sending confirmation email to:", email);

    // **Try-Catch for Email Sending**
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirm Your Email",
        html: `<h3>Click the link below to verify your email:</h3>
              <a href="${confirmationLink}" target="_blank">${confirmationLink}</a>`,
      });
      console.log("✅ Email sent successfully to:", email);
    } catch (emailError) {
      console.error("📧❌ Email sending failed:", emailError);
      return res.status(500).json({ message: "User created, but email failed to send." });
    }

    res.status(201).json({ message: "User created. Check your email to confirm your account." });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// 📧 Email Confirmation Route
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified. You can now log in!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Invalid or expired token' });
  }
});

// 🔑 Update Login Route to Require Email Confirmation
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user._id });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
