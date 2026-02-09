import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import './LoginPage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added for UX

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ The Correct Way: Calling the central authApi helper
      await authApi.ForgotPassword(email);
      setMessage(`If an account exists for ${email}, a reset link has been sent.`);
    } catch (err) {
      console.error("Reset error: ", err);
      // We use a generic message here for security (don't reveal if email exists)
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-container-card">
        <div className="login-brand-section">
          <h2>Reset Password</h2>
          <p>Enter your email to receive a recovery link</p>
        </div>

        {/* Success / Info Message Display */}
        {message ? (
          <div className="login-alert-box success-alert">
            <p>{message}</p>
            <Link to="/login" className="login-primary-btn" style={{textAlign: 'center', display: 'block', marginTop: '1rem', textDecoration: 'none'}}>
               Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-inner-form">
            <div className="login-field">
              <label>Recovery Email</label>
              <input 
                type="email" 
                placeholder="Enter your registered email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className="login-primary-btn" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!message && (
          <div className="login-extra-links">
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;