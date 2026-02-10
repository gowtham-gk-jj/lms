import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import './CreateUser.css';

const CreateUser = () => {
  const { user,logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'learner' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.prefill) {
      setFormData({
        name: location.state.prefill.name,
        email: '',
        password: '',
        role: location.state.prefill.role 
      });
    }
  }, [location.state]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await authApi.createUser(formData,);

    // 2. If we are in "Succession Mode", deactivate the old account now
    if (location.state?.prefill) {
      // Use the ID of the current logged-in user (you)
      await authApi.updateUserStatus(user._id, false,);
      
      alert("Successor created and your old account has been deactivated. You will now be logged out.");
      logout();
      navigate('/login');
      return;
    }

    alert("User created successfully!");
    navigate('/users');
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="form-header">
          {/* Change title only if it's an admin succession */}
          <h2>{location.state?.prefill ? "Appoint Successor Admin" : "Create New User"}</h2>
          <p>Fill in the details to register a new account.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter full name"
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter email"
              required 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className='form-group'>
            <label>Password</label>
            <input
              type="password"
              placeholder='Enter Password'
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}/>
          </div>

          <div className="form-group">
            <label>System Role</label>
            <select 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})}
              // Lock the dropdown ONLY if it's an admin succession
              disabled={location.state?.prefill?.role === 'admin'}
            >
              <option value="learner">Learner</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/users')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : location.state?.prefill ? "Appoint Admin" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;