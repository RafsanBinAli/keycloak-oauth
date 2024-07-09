import React, { useState,useEffect } from "react";

const Hello = () => {
  const [dummyData, setDummyData] = useState(null);
  const [token,setToken] =useState("")
  const [tokenTime, setTokenTime]=useState(null);
  
  useEffect(() => {
    // Function to retrieve JWT token from localStorage
    const getJwtTokenFromStorage = () => {
      const tokenString = localStorage.getItem("jwtToken");
      if (tokenString) {
        const tokenObject = JSON.parse(tokenString);
        setToken(tokenObject.token); // Set the token state
        setTokenTime(tokenObject.expiresAt); // Set the token expiry time state
        return tokenObject.token; // Return the token
      }
      return null;
    };

    // Retrieve JWT token from localStorage
    const token = getJwtTokenFromStorage();

    // Ensure token exists before fetching data
    if (token) {
      setToken(token);
    }
  }, []);

   const fetchData = async () => {
    try {
      // Check if token needs refreshing
      if (tokenTime && tokenTime < Date.now()) {
        const response = await fetch("http://localhost:5000/check-expiry", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setToken(data.token); // Update token state with the new token
          localStorage.setItem(
            "jwtToken",
            JSON.stringify({ token: data.token, expiresAt: data.expiresAt })
          ); // Update localStorage with new token and expiry time
        } else {
          console.error("Failed to refresh token");
        }
      }

      // Fetch dummy data using the updated token
      const response = await fetch("http://localhost:5000/dummy-data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDummyData(data);
      } else {
        console.error("Failed to fetch dummy data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>
        <button onClick={fetchData}> Say hello to Backend</button>
      </div>
      {dummyData && (
        <div>
          <h2>Dummy Data:</h2>
          <p>Message: {dummyData.message}</p>
          <p>Timestamp: {dummyData.timestamp}</p>
        </div>
      )}
    </>
  );
};

export default Hello;
