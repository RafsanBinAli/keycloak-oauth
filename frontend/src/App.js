import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [jwtToken, setJwtToken] = useState('');
  const [dummyData, setDummyData] = useState(null);

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

  // Function to call backend and get dummy data
  const fetchDummyData = async () => {
    try {
      const response = await fetch('http://localhost:5000/check-expiry', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDummyData(data);
      } else {
        console.error('Failed to fetch dummy data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          JWT Token: {jwtToken}
        </p>
        <button onClick={fetchDummyData}>
          Get Dummy Data
        </button>
        {dummyData && (
          <div>
            <h2>Dummy Data:</h2>
            <pre>{JSON.stringify(dummyData, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
