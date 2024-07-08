const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");
const mongoose = require('mongoose');

dotenv.config();
require("./config/passport");

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

const app = express();
app.use(cookieParser());
app.use(session({
  secret: 'secret', 
  resave: false, 
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false,
    sameSite: 'none'
  }
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/authRoute");
const protectedRoute = require('./routes/protectedRoute');

app.use("/", authRoutes);
app.use("/protected-route", protectedRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
