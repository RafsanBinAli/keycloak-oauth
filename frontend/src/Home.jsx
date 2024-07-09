import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [dummyData, setDummyData] = useState(null);

  useEffect(() => {
    // Function to retrieve JWT token from cookie
    const getJwtTokenFromCookie = () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwtToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      return token;
    };

    // Retrieve JWT token from cookie
    const token = getJwtTokenFromCookie();

    // Set expiration time 60 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 1);

    // Save JWT token and expiration time in localStorage
    localStorage.setItem(
      "jwtToken",
      JSON.stringify({
        token: token,
        expiresAt: expiresAt.getTime(), // Save as timestamp
      })
    );
    // Set state with JWT token
    setJwtToken(token);
  }, []);

  const navigate = useNavigate();
  const handleRouteChange = () => {
    navigate("/hello");
  };
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleRouteChange}>Go to hello</button>
      </header>
    </div>
  );
};
export default Home;
