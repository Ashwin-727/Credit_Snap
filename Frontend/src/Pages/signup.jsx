import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import studentLogo from '../assets/Student_without_bg_logo.png'; 

const Signup = () => {
  const navigate = useNavigate();

  // Field States
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [hallNo, setHallNo] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status States
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    // Validation Check
    if (!email.endsWith('@iitk.ac.in')) {
      setErrorMsg('You must register with a valid @iitk.ac.in email address.');
      return; 
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const hallNum = parseInt(hallNo, 10);
    if (isNaN(hallNum) || hallNum < 1 || hallNum > 14) {
      setErrorMsg('Incorrect Hall Number. Please enter a valid Hall Number between 1 and 14.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phoneNo: phoneNo,
          password: password,
          role: 'student',
          rollNo: rollNo,
          hallNo: hallNo,
          roomNo: roomNo
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Redirect to the pending verification page
        navigate('/verify-email-pending');
      } else {
        setErrorMsg('Signup failed: ' + data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrorMsg('Cannot connect to the backend server. Is nodemon running?');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left-panel">
        <div className="signup-brand-logo-wrap">
          <img 
            src={studentLogo} 
            alt="CreditSnap Student Logo" 
            className="signup-brand-logo" 
          />
        </div>
      </div>

      <div className="signup-right-panel">
        <div className="form-container">
          <h1 className="signup-heading">SIGN UP</h1>
          
          <form className="signup-form" onSubmit={handleSignup}>
            {errorMsg && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{errorMsg}</div>}

            <div className="input-group">
              <input type="text" placeholder="Full Name" className="custom-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            
            <div className="input-group">
              <input type="text" placeholder="Roll Number" className="custom-input" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
            </div>

            <div className="input-group">
              <input 
                type="email" 
                placeholder="IITK Email" 
                className="custom-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="custom-input" 
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required 
              />
            </div>

            <div className="split-group">
              <input type="text" placeholder="Hall No" className="custom-input" value={hallNo} onChange={(e) => setHallNo(e.target.value)} required />
              <input type="text" placeholder="Room No" className="custom-input" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} required />
            </div>

            <div className="input-group">
              <input type="password" placeholder="Password" className="custom-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="input-group">
              <input type="password" placeholder="Confirm Password" className="custom-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            
            <button type="submit" className="primary-signup-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING EMAIL...' : 'SIGN UP'}
            </button>
          </form>

          <div className="login-redirect">
            <span className="light-text">Already have account? </span>
            <a href="/">Login.</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;