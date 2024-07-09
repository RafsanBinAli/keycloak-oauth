const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const jwt =require("jsonwebtoken")
dotenv.config();
require("./config/passport");
// const redisClient = require('./redisClient');

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/authRoute");


app.use("/", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
