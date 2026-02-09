import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import './LoginPage.css'; 

const ResetPassword = () => {
  const { token } = useParams(); // Extracts the reset token from the URL path
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    
    // Basic validation logic
    if (password.length < 6) {
        return setStatus({ type: 'error', message: 'Password must be at least 6 characters long' });
    }

    if (password !== confirmPassword) {
        return setStatus({ type: 'error', message: 'Passwords do not match' });
    }

    try {
      setLoading(true);
      
      // ✅ Module 5: Calls the API with the token and new password
      await authApi.resetPassword(token, password);
      
      setStatus({ 
        type: 'success', 
        message: 'Password reset successful! Redirecting to login...' 
      });
      
      // Automatic redirection after a short delay
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.message || 'The reset link is invalid or has expired' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-container-card">
        
        <div className="login-brand-section">
          <h2>Create New Password</h2>
          <p>Secure your account with a new password.</p>
        </div>

        {status.message && (
          <div className={`login-alert-box ${status.type === 'success' ? 'success-alert' : ''}`}>
            <span className="alert-icon">
              {status.type === 'success' ? '✅' : '⚠️'}
            </span> 
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-inner-form">
          <div className="login-field">
            <label>New Password</label>
            <input 
              type="password" 
              placeholder="Minimum 6 characters" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || status.type === 'success'}
            />
          </div>

          <div className="login-field">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Repeat new password" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || status.type === 'success'}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-primary-btn"
            disabled={loading || status.type === 'success'}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="login-extra-links" style={{ textAlign: 'center', marginTop: '15px' }}>
             <button 
                onClick={() => navigate('/login')} 
                style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '14px' }}
             >
                Return to Login
             </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;