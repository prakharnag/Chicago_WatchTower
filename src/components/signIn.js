import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import '../styles/signIn.css';

function SignIn() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    console.log('I am Clicked');
      // setUsernameError(false);
      // setPasswordError(false);
      // setError('');

      // if (username.trim() === '') {
      //     setUsernameError(true);
      //     return;
      // }

      // if (password.trim() === '') {
      //     setPasswordError(true);
      //     return;
      // }

      // try {
      //     // Fetch user data from Elasticsearch based on the provided username (email)
      //     const response = await fetch(`http://localhost:9200/users/_search?q=email:${username}&size=1`);
      //     if (!response.ok) {
      //         throw new Error('Failed to authenticate');
      //     }

      //     const userData = await response.json();
      //     console.log(userData); // Check the userData object in the console

      //     // Ensure that userData.hits.hits[0]._source.email is not undefined
      //     const userEmail = userData.hits.hits[0]._source.email;

      //     // Check if the user is active
      //     const isActive = userData.hits.hits[0]._source.active;

      //     if (isActive) {
      //         if (userEmail === username && userData.hits.hits[0]._source.password === password) {
      //             setShowSuccessBanner(true);
      //             setTimeout(() => {
      //                 const { username, role, firstName, lastName } = userData.hits.hits[0]._source;
      //                 setShowSuccessBanner(false);
      //                 // Store user data in local storage
      //                 localStorage.setItem('username', userEmail);
      //                 localStorage.setItem('user', `${firstName} ${lastName}`);
      //                 localStorage.setItem('signin', true);
      //                 localStorage.setItem('role', role);
      //                 window.location.href = "/";
      //             }, 1000);
      //         } else {
      //             setError('Invalid username or password');
      //         }
      //     } else {
      //         setError('User is inactive. Please contact the administrator.');
      //     }
      // } catch (error) {
      //     console.error('Error authenticating user:', error);
      //     setError('Failed to authenticate. Please try again later.');
      // }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      const user = result.user;
      window.location.href = "/";

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
          <h2 className="signin-heading">Sign In</h2>
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