import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../Login/Login.css';
import { passwordStrength } from "check-password-strength";
import { checkPasswordStrength } from '../utils/Password';
import BACKEND_URL from '../config';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const token = searchParams.get('token');


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const pwd = e.target.value;
    setPassword(pwd);
    const result = checkPasswordStrength(pwd);
    setStrength(result.value); // update strength for display
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!id || !token) {
      setError('Invalid or expired reset link');
      return;
    }

    setIsLoading(true);
     const result = checkPasswordStrength(password); // final check on submit
   if(result.value !== "Strong") {
  toast.error("Password must be strong");
  setIsLoading(false);
  return;
}
    try {
      await axios.post(`${BACKEND_URL}/api/resetPassword?id=${id}&token=${token}`, { password });
      toast.success('Password has been reset successfully!');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Something went wrong';
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
            <h1 className="login-title">Reset Password</h1>
            <p className="login-subtitle">
              Enter your new password below
            </p>
          </div>

          {error && <div className="error-message show">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">New Password</label>
               <div className="password-container">
              <input
              type={showPassword ? 'text' : 'password'}
                
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="form-control"
                placeholder="Enter new password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            </div>
 {/*Live password strength display */}
            {password && (
              <p className={`strength-text ${strength.toLowerCase()}`}>
                Password Strength: {strength}
              </p>
            )}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="password-container">
              <input
                type={showPasswordConfirmation ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="Confirm new password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              >
                {showPasswordConfirmation ? 'Hide' : 'Show'}
              </button>
            </div>
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
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}  