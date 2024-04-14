import React,{useState} from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


function SignIn() {

   
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
      
        const handleSubmit = (event) => {
          event.preventDefault();
          // handle form submission here, e.g., send data to server for login
          alert(`You have submitted username: ${username} and password: ${password}`);
        }

  const handleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
     
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
   
      const user = result.user;
     
    } catch (error) {
      
      const errorCode = error.code;
      const errorMessage = error.message;
      
      const email = error.customData.email;
      
      const credential = GoogleAuthProvider.credentialFromError(error);
    
    }
  };

  return (<div className="login-container">
  <h1>Login</h1>
  <form onSubmit={handleSubmit}>
    <label htmlFor="username">Username</label>
    <input
      type="text"
      id="username"
      name="username"
      value={username}
      onChange={(event) => setUsername(event.target.value)}
    />
    <label htmlFor="password">Password</label>
    <input
      type="password"
      id="password"
      name="password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
    />
    <div className="checkbox-container">
      <input type="checkbox" id="remember-me" name="remember-me" />
      <label htmlFor="remember-me">Remember Me</label>
    </div>
    <button type="submit">SIGN IN</button>
    <a href="#">Forgot Password</a>
  </form>
  <div className="social-container">
    <p>- Or Sign In With -</p>
    <a href="#">Facebook</a>
    <a href="#">Twitter</a>
  </div>
</div>

  );
}

export default SignIn;
