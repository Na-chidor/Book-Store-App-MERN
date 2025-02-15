import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // ✅ New field for email verification
});

export const User = mongoose.model('User', userSchema);
