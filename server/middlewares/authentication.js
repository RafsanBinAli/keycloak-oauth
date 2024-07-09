exports.isAuthenticated = (req, res, next) => {
  
    if (req.isAuthenticated()) {
      next(); // Proceed to the next middleware or route handler
    } else {
      res.redirect("/login"); // Redirect to Google authentication
    }
  };