import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Received Registration Request:", { name, email }); // ✅ Log request data

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email); // ✅ Log if user already exists
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log("User saved to database:", newUser._id); // ✅ Log user creation

    // Generate JWT token
    try {
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ message: 'User created successfully', token });
    } catch (jwtError) {
      console.error("JWT Sign Error:", jwtError); // ✅ Log JWT errors
      return res.status(500).json({ message: 'JWT generation failed', error: jwtError.message });
    }

  } catch (error) {
    console.error("Registration Error:", error); // ✅ Log the actual error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
