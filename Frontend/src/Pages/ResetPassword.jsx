import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import studentLogo from '../assets/Student_without_bg_logo.png'; 

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/users/resetPassword/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMsg('Password reset successful! Redirecting to login...');

        // Wait a brief moment so they can read the success message
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrorMsg(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      setErrorMsg('Cannot connect to the backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-left-panel">
        <img 
          src={studentLogo} 
          alt="CreditSnap Logo" 
          className="brand-logo" 
        />
      </div>

      <div className="forgot-right-panel">
        <div className="form-container">
          <h1 className="forgot-heading">RESET PASSWORD</h1>
          
          <p className="instruction-text">
            Enter your new password below.
          </p>
          
          <form className="forgot-form" onSubmit={handleReset}>
            {successMsg && <div style={{ color: 'green', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{successMsg}</div>}
            
            <div className="input-group">
              <input 
                type="password" 
                placeholder="New Password" 
                className="custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                className="custom-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              {errorMsg && <span className="error-text">{errorMsg}</span>}
            </div>
            
            <button type="submit" className="primary-forgot-btn" disabled={isSubmitting}>
              {isSubmitting ? 'RESETTING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
