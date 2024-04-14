import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignIn from './components/signIn';
import firebaseConfig from './Authentication/firebase';
import { initializeApp } from "firebase/app";
import dashboard from './components/dashboard';

const app = initializeApp(firebaseConfig);

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<dashboard />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
