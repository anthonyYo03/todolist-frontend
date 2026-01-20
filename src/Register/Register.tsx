import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { checkPasswordStrength } from '../utils/Password';
import BACKEND_URL from '../config';

export default function Register() {
  const [userInfo, setUserInfo] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
  setUserInfo({ ...userInfo, password: pwd });
  const result = checkPasswordStrength(pwd);
  setStrength(result.value); // update strength for display
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = checkPasswordStrength(userInfo.password); // final check on submit
   if(result.value !== "Strong") {
  toast.error("Password must be strong");
  return;
}


    try {
      await axios.post(`${BACKEND_URL}/api/register`, userInfo);
      toast.success('Registration successful!');
      setTimeout(() => navigate('/login'), 1000);
      setUserInfo({ username: '', email: '', password: '' });
      setStrength('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed.');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={userInfo.username}
              onChange={e => setUserInfo({ ...userInfo, username: e.target.value })}
              className="form-control"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={userInfo.email}
              onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={userInfo.password}
                onChange={handlePasswordChange} // ✅ live update
                className="form-control"
                placeholder="Create a password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* ✅ Live password strength display */}
            {userInfo.password && (
              <p className={`strength-text ${strength.toLowerCase()}`}>
                Password Strength: {strength}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary">Sign Up</button>
          <div className="link-text">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
