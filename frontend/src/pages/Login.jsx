import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = async () => {
        try {
            const { data } = await axios.post('https://book-store-app-mern-api.vercel.app/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            enqueueSnackbar('Login successful', { variant: 'success' });
            navigate('/home');
        } catch (error) {
            enqueueSnackbar('Error logging in', { variant: 'error' });
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;