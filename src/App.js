import './App.css';
import SignIn from './components/signIn';
import firebaseConfig from './Authentication/firebase';
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);

function App() {
  return (
<div>
      <h1>Your App</h1>
      <SignIn />
    </div>
  );
}

export default App;
