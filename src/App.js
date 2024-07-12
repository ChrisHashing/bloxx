import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './SignUp';
import Login from './Login';
import Profile from './Profile';
import UserList from './UserList';
import Home from './Home'; // Assuming Home.js is where you have the Home component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-list" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;