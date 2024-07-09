const jwt = require('jsonwebtoken');

function generateJWT(accessToken, userEmail, sharedGroups) {
  const payload = {
    accessToken: accessToken,
    email: userEmail,
    groups: sharedGroups,
  };

  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);

  return jwtToken;
}

module.exports = generateJWT;
