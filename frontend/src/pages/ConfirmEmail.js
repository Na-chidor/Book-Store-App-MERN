import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get(`https://book-store-app-mern-api.vercel.app/auth/confirm/${token}`)
            .then((response) => {
                setMessage(response.data.message);
                setTimeout(() => navigate('/login'), 3000);
            })
            .catch((error) => {
                setMessage('Invalid or expired token.');
            });
    }, [token, navigate]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">{message}</h2>
                {message.includes('verified') && <p>Redirecting to login...</p>}
            </div>
        </div>
    );
};

export default ConfirmEmail;
