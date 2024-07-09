const express = require("express");
const passport = require("passport");
const { getUserGroups } = require("../user-service"); // Assuming you have a userService for fetching user groups
const jwt = require("jsonwebtoken");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authentication");
const { checkAndRefreshToken } = require("../controllers/authController");
const redisClient = require("../redisClient");
const authenticateJWT = require("../middlewares/authenticateJWT");
const generateJWT = require("../functions/generateJWT");
//functions

function storeUserDataInRedis(userEmail, accessToken, sharedGroups, expiresIn) {
  const now = Date.now(); // Current timestamp in milliseconds
  const expiresInMilliseconds = expiresIn * 1000; // Convert expiresIn to milliseconds
  console.log("expires at", now + expiresInMilliseconds);
  const userData = {
    user_email: userEmail,
    groups: sharedGroups,
    accessToken: accessToken,
    expiresAt: now + expiresInMilliseconds, // Calculate expiration time in milliseconds
  };
  const expireTimeforRedis= 3600*1000;

  const jsonString = JSON.stringify(userData);
  const redisKey = `user:${userEmail}`;

  redisClient.setEx(redisKey,expireTimeforRedis, jsonString, (err, reply) => {
    if (err) {
      console.error(`Error storing data for ${redisKey} in Redis:`, err);
    } else {
      console.log(`Data stored for ${redisKey} in Redis:`, reply);
    }
  });
}

//routes

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  isAuthenticated, // Use isAuthenticated middleware
  async (req, res) => {
    try {
      // Call the function to get user groups based on req.user.email
      const groups = await getUserGroups(req.user.email);

      // Extract group names from groups response
      const sharedGroups = groups.map((group) => group.name);

      const expireTime = 60;
      storeUserDataInRedis(
        req.user.email,
        req.user.accessToken,
        sharedGroups,
        expireTime
      );

      // Generate JWT token
      const jwtToken = generateJWT(
        req.user.accessToken,
        req.user.email,
        sharedGroups
      );
      // , { httpOnly: true }

      res.cookie("jwtToken", jwtToken);

      // Redirect to frontend (http://localhost:3000)
      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error fetching user groups:", error);
      res.redirect("/failure");
    }
  }
);

router.get("/dummy-data", authenticateJWT, (req, res) => {
  console.log(req);
  const dummyData = {
    message: "This is some dummy data",
    timestamp: new Date().toISOString(),
  };

  res.json(dummyData);
});

router.get(
  "/check-expiry",
  authenticateJWT,
  checkAndRefreshToken,
  (req, res) => {
    console.log(req.newJWT);
  }
);

module.exports = router;
