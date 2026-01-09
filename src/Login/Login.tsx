import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import BACKEND_URL from '../config';

export default function Login() {
  const [userLogin, setUserLogin] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!userLogin.username.trim() || !userLogin.password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${BACKEND_URL}/api/login`, userLogin, { 
        withCredentials: true 
      });
      
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
      setUserLogin({ username: '', password: '' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleDemoLogin = () => {
    // Optional: Fill with demo credentials
    setUserLogin({
      username: 'demo_user',
      password: 'demo123'
    });
  };

  return (
    <>
     
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="error-message show">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={userLogin.username}
                onChange={e => setUserLogin({...userLogin, username: e.target.value})}
                className="form-control"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={userLogin.password}
                  onChange={e => setUserLogin({...userLogin, password: e.target.value})}
                  className="form-control"
                  placeholder="Enter your password"
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
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

           

            <div className="link-text">
              Don't have an account? <Link to="/">Sign up now</Link>
            </div>
            
            <div className="link-text">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

