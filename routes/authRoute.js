const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: 'offline',
    prompt: 'consent'
  })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  (req, res) => {
    const accessToken = req.user.accessToken; // Retrieve access token
   res.redirect("/protected-route")
  }
);

module.exports = router;
