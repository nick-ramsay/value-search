const express = require("express");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require("dotenv").config();

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const keys = require('./keys');

const routes = require("./routes");

const db = require("./models");

passport.use(db.Users.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  db.Users.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/google/callback",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
  function (accessToken, refreshToken, profile, cb) {
    db.Users.findOrCreate({ googleId: profile.id, givenName:profile.name.givenName, familyName:profile.name.familyName, displayName: profile.displayName, photos: profile.photos[0].value }, function (err, user) {
      return cb(err, user);
    });
  }
));

const PORT = process.env.PORT || 3001;
const app = express();
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  function (req, res) {
    // Successful a, redirect secrets.
    res.redirect("http://localhost:3000");
  });

app.get("/logout", function (req, res) {
  res.redirect("http://localhost:3000/");
});


// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//Setting headers for CORS Policies
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Add routes, both API and view 
app.use(routes);

app.use(passport.initialize());
app.use(passport.session());

// Connect to the Mongo DB

const connection = (process.env.NODE_ENV === "production" ? process.env.MONGO_URI : keys.mongodb.mongo_uri);

if (process.env.NODE_ENV === "production") {
  mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));
} else {
  mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/value-search", { useNewUrlParser: true, useUnifiedTopology: true }); // <-- Dev/Prod connection
  //mongoose.connect(process.env.MONGO_URI || "mongodb://mongo/value-search", { useNewUrlParser: true, useUnifiedTopology: true }); // <-- Docker build connection
}

//Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});