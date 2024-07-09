import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    // Function to retrieve JWT token from cookie
    const getJwtTokenFromCookie = () => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwtToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      return token;
    };

    // Retrieve JWT token from cookie
    const token = getJwtTokenFromCookie();
    setJwtToken(token);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
       
        <p>
          JWT Token: {jwtToken}
        </p>
        
      </header>
    </div>
  );
}

export default App;
