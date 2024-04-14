import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import firebaseConfig from './Authentication/firebase';
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
