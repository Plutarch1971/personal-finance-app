//ForgotPassword.tsx
import React, { useState } from 'react';
import api from '../api/axios';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Call API to request password reset
        try {
            await api.post ('/auth/forgot-password',{ email });
            console.log('Reset request submitted for:', email);
        } catch (err) {
            console.error(err);
        }     
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center flex-column">
            <h2 className="text-center text-white position-absolute start-50 translate-middle-x" style={{ top: '60px' }}>SmartBooks Finance</h2>
            <div className="card shadow" style={{ width: '100%', maxWidth: '500px'}}>
                <form className="mt-4 p-6" onSubmit={handleSubmit}>
                    <h4 className="text-center mb-4">Forgot Password</h4>
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