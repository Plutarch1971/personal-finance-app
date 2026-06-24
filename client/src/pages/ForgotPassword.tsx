//ForgotPassword.tsx
import React, { useState } from 'react';
import api from '../api/axios';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setError('');
   
        try {
                await api.post ('/auth/forgot-password',{ email });
                setMessage('Password reset link sent! Check your inbox.');
            } catch (err: any) {
                setError('Something went wrong. Plese try again.');
            }     
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center flex-column">
            <h2 className="text-center text-white position-absolute start-50 translate-middle-x" style={{ top: '60px' }}>SmartBooks Finance</h2>
            <div className="card shadow" style={{ width: '100%', maxWidth: '500px'}}>
                <form className="mt-4 p-6" onSubmit={handleSubmit}>
                    <h4 className="text-center mb-4">Forgot Password</h4>

                    {message && (
                        <div className="alert alert-success">{message}</div>
                    )}
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}
                    <label className="fs-6 p-2">Enter email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        required
                    />
                    <button className="btn btn-primary p-2 mb-2 ms-2" type="submit">
                        Send Reset Link
                    </button>
                </form>
        </div>
        </div>
    );
};

export default ForgotPassword;