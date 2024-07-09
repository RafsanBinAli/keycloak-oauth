const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  let token = req.cookies.jwtToken || req.headers["authorization"];
  console.log(token);
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  // If the token is in the Authorization header, it will have the format "Bearer <token>"
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft(); // Remove "Bearer " prefix
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach the decoded payload to req.user
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.sendStatus(403); // Forbidden
  }
}

module.exports = authenticateJWT;
