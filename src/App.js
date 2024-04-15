import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignIn from './components/signIn';
import firebaseConfig from './Authentication/firebase';
import { initializeApp } from "firebase/app";
import Dashboard from './components/dashboard';



function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
