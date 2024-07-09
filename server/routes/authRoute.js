const express = require("express");
const passport = require("passport");
const { getUserGroups } = require("../user-service"); // Assuming you have a userService for fetching user groups
const jwt = require("jsonwebtoken");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authentication");
// const redisClient = require('../redisClient');
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

      // Store sharedGroups in a constant or database if needed
      const sharedGroupsConstant = sharedGroups;

      // Generate JWT token
      const jwtToken = generateJWT(
        req.user.accessToken,
        req.user.email,
        sharedGroups
      );
      // , { httpOnly: true }

      res.cookie('jwtToken', jwtToken);

      // Redirect to frontend (http://localhost:3000)
      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error fetching user groups:", error);
      res.redirect("/failure");
    }
  }
);

function generateJWT(accessToken, userEmail, sharedGroups) {
  // Define JWT payload
  const payload = {
    accessToken: accessToken,
    email: userEmail,
    groups: sharedGroups,
  };

  // Sign the JWT token with a secret key and set an expiry time
  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });


  //In here we will save the user email, and the groups he is associated with , plus accessToken
  // redisClient.set(`user:${userEmail}`, JSON.stringify(payload), 'EX', 3600); // Expires in 1 hour

  return jwtToken;
}

module.exports = router;
