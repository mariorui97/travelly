// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");
require('dotenv').config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const projectName = "travelly";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
      maxAge: 1000 * 24* 60 * 60 // your cookie will be cleared after these seconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb+srv://jcsfpc:BUy2Tc7S!@cluster0.yus1q.mongodb.net/travelly?retryWrites=true&w=majority",
      // Time to Live for sessions in DB. After that time it will delete it!
      ttl: 24* 60 * 60 // your session will be cleared after these seconds
    })
  }));


// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const auth = require("./routes/auth.routes");
app.use("/", auth);

const profile = require("./routes/profile.routes");
app.use("/", profile);

// const editPprofile = require("./routes/profile/edit");
// app.use("/", editPprofile);

const myTrips = require("./routes/myTrips.routes");
app.use("/", myTrips);

const flights = require("./routes/flights.routes");
app.use("/", flights);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
