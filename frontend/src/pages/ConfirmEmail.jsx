import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying email...');

    useEffect(() => {
        if (!token) {
            setMessage('Invalid or missing token.');
            return;
        }

        axios.get(`https://book-store-app-mern-api.vercel.app/auth/confirm/${token}`)
            .then((response) => {
                setMessage(response.data.message || 'Email verified successfully!');
                setTimeout(() => navigate('/login'), 3000);
            })
            .catch(() => {
                setMessage('Invalid or expired token.');
            });
    }, [token, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                    {message}
                </h2>
                {message.includes('verified') && (
                    <p className="text-gray-500">Redirecting to login...</p>
                )}
            </div>
        </div>
    );
};

export default ConfirmEmail;
