const express = require('express');
const router = express.Router();
const { checkAndRefreshToken } = require('../controllers/authController');

router.get('/', checkAndRefreshToken, (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`This is a protected route. User info: ${JSON.stringify(req.user)}`);
  } else {
    res.redirect('/auth/google');
  }
});

module.exports = router;
