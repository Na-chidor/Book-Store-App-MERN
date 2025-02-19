import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [name, setName] = useState("");  // ✅ Add Name State

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    const data = { name, email, password };  // ✅ Include name
  
    setLoading(true);
    axios
      .post("https://book-store-app-mern-api.vercel.app/auth/register", data)
      // .post("http://localhost:5555/auth/register", data)
      .then((response) => {
        setLoading(false);
        navigate("/login"); // Redirect to login page after successful registration
      })
      .catch((error) => {
        setLoading(false);
        console.error("❌ Registration Error:", error.response?.data || error.message); // ✅ Log actual error
        setError(error.response?.data?.message || "Registration failed. Please try again later.");
      });      
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Create an Account</h1>
  
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
  
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-lg text-gray-700" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}  // ✅ Update Name
              placeholder="Enter your full name"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3 mt-6 bg-blue-600 text-white rounded-lg text-lg font-semibold ${loading && "opacity-50 cursor-not-allowed"}`}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
          <div className="text-center mt-4">
            <span className="text-gray-700">Already have an account? </span>
            <a href="/login" className="text-blue-600 font-semibold">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
  };

export default Register;