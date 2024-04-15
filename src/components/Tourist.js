import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import ChatBotModel from './ChatBotModel';

function Tourist() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search Query:', searchQuery);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="left-section">
      <h1 style={{ fontFamily: 'Raleway', color: 'black' }} className="dashboard-title">Search for Places</h1>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-container">
            <TextField
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <Button type="submit" className="search-button" variant="contained">
              Search
            </Button>
          </div>
        </form>
      </div>
      <div className="right-section">
        {/* Content for the static section goes here */}
        <Button onClick={handleLogout} className="logout-button">
          Logout
        </Button>
      </div>
      <ChatBotModel />
    </div>
  );
}

export default Tourist;