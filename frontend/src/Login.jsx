import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const handleLogin = async () => {
    // Redirect the user to the Google OAuth authentication URL on the backend
    window.location.href = "http://localhost:5000/auth/google";
  };
  return (
    <>
      <button
        className=""
        onClick={handleLogin}
        style={{
          textDecoration: "none", // Remove underline
          color: "#ffffff", // Text color
          backgroundColor: "#007bff", // Background color
          padding: "10px 20px", // Padding
          borderRadius: "5px", // Rounded corners
          display: "inline-block", // Display as inline block
        }}
      >
        Login with Google
      </button>
    </>
  );
};

export default Login;
