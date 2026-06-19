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
        <form className="mt-4" onSubmit={handleSubmit}>
            <label className="fs-6">Enter email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
            />
            <button className="btn btn-primary mt-2" type="submit">
                Submit
            </button>
        </form>
    );
};

export default ForgotPassword;