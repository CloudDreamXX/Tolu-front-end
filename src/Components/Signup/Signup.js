import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../ReduxToolKit/Slice/userSlice';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";

export const Signup = () => {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector(state => state.user);


  const handleSubmit = (event) => {
    event.preventDefault();
    // Basic client-side validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      console.error('Please fill all the fields.');
      return;
    }
    if (password !== confirm) {
      console.error('Passwords do not match.');
      return;
    }
    // Dispatch the action to create a user
    dispatch(createUser({
      name,
      email,
      password,
      navigate: () => navigate("/newsearch") 
    }));
  };

  return (
    <div className='container-fluid bg-white'>
      <div className='signup-body'>
        <div className='row'>
          <div className='col-lg-4'></div>
          <div className='col-lg-4 signup-box'>
            <h1 className='heading'>Sign Up</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  id="Text1"
                  placeholder="Enter User Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="Email1"
                  placeholder="Enter Email"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  id="Password1"
                  placeholder="Password"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="form-control"
                  id="ConfirmPassword1"
                  placeholder="Confirm Password"
                />
              </div>
              <button type="submit" className="btn btn-secondary" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
            {error && <span className='error-text'>Error: {error}</span>}
          </div>
          <div className='col-lg-4'></div>
        </div>
      </div>
    </div>
  );
};
