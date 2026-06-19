//ResetPassword.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
        }

        if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
        }

        try {
        setLoading(true);

        await api.post(
            `/auth/reset-password/${token}`,
            { password }
        );

        setSuccess(
            'Password reset successful. Redirecting to login...'
        );

        setTimeout(() => {
            navigate('/login');
        }, 3000);

        } catch (err: any) {
        setError(
            err?.response?.data?.message ||
            'Unable to reset password.'
        );
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-sm mx-auto p-4"
        style={{ maxWidth: '450px' }}
      >
        <h2 className="text-center mb-4">
          Reset Password
        </h2>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              New Password
            </label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Confirm Password
            </label>

            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? 'Resetting Password...'
              : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;