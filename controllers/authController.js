const axios = require('axios');
const User = require('../models/User');

async function getNewAccessToken(refreshToken) {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to refresh access token');
  }
}

async function checkAndRefreshToken(req, res, next) {
    if (req.isAuthenticated()) {
      try {
        const user = await User.findById(req.user._id).exec(); // Use .exec() to return a promise
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Implement logic to check if access token is expired
        const isAccessTokenExpired = () => {
          // Implement your logic to check if the access token is expired
        };
  
        if (isAccessTokenExpired()) {
          try {
            const newAccessToken = await getNewAccessToken(user.refreshToken);
            user.accessToken = newAccessToken; // Update access token
            await user.save();
            req.user.accessToken = newAccessToken; // Update session user
          } catch (error) {
            return res.status(401).json({ message: 'Failed to refresh access token' });
          }
        }
  
        next(); // Continue to the next middleware or route handler
      } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      next(); // If not authenticated, proceed to the next middleware or route handler
    }
  }

module.exports = {
  getNewAccessToken,
  checkAndRefreshToken,
};
