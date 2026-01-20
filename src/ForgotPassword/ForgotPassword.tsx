import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';
import BACKEND_URL from '../config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/requestPasswordReset`, { email });
      toast.success('Password reset link sent to your email!');
      setEmail('');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Something went wrong.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <>
     
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Forgot Password</h1>
            <p className="login-subtitle">
              Enter your email to receive a password reset link
            </p>
          </div>

          {error && <div className="error-message show">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
