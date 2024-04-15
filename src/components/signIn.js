import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider , signInWithEmailAndPassword, signInWithGoogle } from "firebase/auth";
import '../styles/SignIn.css';

function SignIn() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignIn = async () => {
    setUsernameError(false);
    setPasswordError(false);
    setError('');
    console.log(username);
    console.log(password);
    if (username.trim() === '') {
      setUsernameError(true);
      return;
    }

    if (password.trim() === '') {
      setPasswordError(true);
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(auth, username, password);
      setShowSuccessBanner(true);
      setTimeout(() => {
        setShowSuccessBanner(false);
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      console.error('Error authenticating user:', error);
      setError('Username or password is incorrect.');
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      const user = result.user;
      window.location.href = "/tourist";

    } catch (error) {
      setShowSuccessBanner(true);
      const errorCode = error.code;
      const errorMessage = error.message;

      const email = error.customData.email;

      const credential = GoogleAuthProvider.credentialFromError(error);

    }
  };

  return (
    <div className="signin-container">
      <div className="signin-background"></div>
      <div className="signin-content">
        {showSuccessBanner && (
          <div className="success-banner">SignIn successful. Redirecting...</div>
        )}
        <div className="signin-card">
          <h1 className="signin-heading">Chicago Watchtower</h1>
          <h3 className="signin-heading">Sign In</h3>
          {error && <div className="error-message">{error}</div>}
          <br />
          <form>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError}
              helperText={usernameError ? 'Username is required' : ''}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? 'Password is required' : ''}
              style={{ marginTop: '16px' }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSignIn}
              style={{ marginTop: '16px' }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleGoogleSignIn}
              style={{ marginTop: '16px' }}
            >
              Sign In with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;