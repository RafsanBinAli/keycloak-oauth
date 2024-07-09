import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes ,Navigate} from 'react-router-dom';
import './App.css';
import Home from './Home';
import Login from './Login';
import Hello from './Hello';

function App() {
  
  return (
    <div className="App">
     <Router>
      
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path ="/hello" element={<Hello/>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
