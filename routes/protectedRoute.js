const express = require('express');
const router = express.Router();
const { checkAndRefreshToken } = require('../controllers/authController');

router.get('/', checkAndRefreshToken, (req, res) => {
  console.log('Session:', req.session);
  console.log('User authenticated:', req.isAuthenticated());
  console.log('Session ID:', req.sessionID);
  console.log('User object:', req.user);
  if (req.isAuthenticated()) {
    res.send(`This is a protected route. User info: ${JSON.stringify(req.user)}`);
  } else {
    res.redirect('/auth/google');
  }
});

module.exports = router;
