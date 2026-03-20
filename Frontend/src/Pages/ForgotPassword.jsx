import React, { useState } from 'react';
import './ForgotPassword.css';
import studentLogo from '../assets/Student_without_bg_logo.png'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    // Validation Check
    if (!email.endsWith('@iitk.ac.in')) {
      setEmailError('Please enter a valid @iitk.ac.in email address.');
      return; 
    }

    setEmailError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMsg('A password reset link has been sent to your email!');
      } else {
        setEmailError(data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      setEmailError('Cannot connect to the backend server.');
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
          <h1 className="forgot-heading">FORGOT PASSWORD</h1>
          
          <p className="instruction-text">
            Enter your IITK email address and we'll send you a link to reset your password.
          </p>
          
          <form className="forgot-form" onSubmit={handleReset}>
            {successMsg && <div style={{ color: 'green', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{successMsg}</div>}
            <div className="input-group">
              <input 
                type="email" 
                placeholder="IITK Email" 
                className="custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              {emailError && <span className="error-text">{emailError}</span>}
            </div>
            
            <button type="submit" className="primary-forgot-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>

          <div className="login-redirect">
            <span className="light-text">Remember your password? </span>
            <a href="/">Back to Login.</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;