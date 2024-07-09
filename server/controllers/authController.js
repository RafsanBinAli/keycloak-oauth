const axios = require("axios");
const User = require("../models/User");
const redisClient = require("../redisClient");
const generateJWT = require("../functions/generateJWT");

async function getNewAccessToken(refreshToken) {
  try {
    const response = await axios.post(
      "https://www.googleapis.com/oauth2/v4/token",
      null,
      {
        params: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        },
      }
    );
    console.log("New AccessToken Generated from Google api");

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to refresh access token");
  }
}

async function getRedisData(redisKey) {
  
  return redisClient
    .get(redisKey)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

async function setRedisData(redisKey, expiresIn, data) {
  return new Promise((resolve, reject) => {
    redisClient.setEx(redisKey, expiresIn, data, (err, reply) => {
      if (err) {
        return reject(err);
      }
      resolve(reply);
    });
  });
}

async function checkAndRefreshToken(req, res, next) {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const refreshToken = user.refreshToken;
    const redisKey = `user:${user.email}`;

    console.log("refreshToken: ", refreshToken);
    console.log("redisKey: ", redisKey);
    // Retrieve user data from Redis
    const data = await getRedisData(redisKey);
    console.log("data: ", data);
    if (!data) {
      return res.status(401).json({ message: "User data not found in Redis" });
    }

    const userData = JSON.parse(data);
    const now = Date.now();
    const expiresAt = userData.expiresAt;
    
    let newAccessToken = userData.accessToken;
    let tokenRefreshed = false;
    
    // Check if the access token is expired or about to expire
    if (now >= expiresAt) {
      console.log("It has been expired");
      // Access token is expired, use refresh token to get a new one
      newAccessToken = await getNewAccessToken(refreshToken);

      if (newAccessToken) {
        userData.accessToken = newAccessToken;
        userData.expiresAt = now + 60 * 1000; // Assuming 1 hour expiry time

        // Update Redis with the new access token
        await setRedisData(redisKey, 3600, JSON.stringify(userData));

        // Mark token as refreshed
        tokenRefreshed = true;

        // Update the accessToken in req.user
        req.user.accessToken = newAccessToken;
      } else {
        return res
          .status(500)
          .json({ message: "Unable to refresh access token" });
      }
    }
    if (tokenRefreshed) {
      // Generate a new JWT token with the new access token
      const newJWT = generateJWT(newAccessToken, user.email, req.user.groups);
      req.newJWT = newJWT;
    }

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getNewAccessToken,
  checkAndRefreshToken,
};
