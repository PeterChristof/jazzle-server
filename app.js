// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

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

const session = require("express-session");

app.set("trust proxy", 1); //Security requirements from Heroku

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      //sameSite: "none", //both fe and be are running on the same hostname  **********FOR DEPLOYMENT
      sameSite: true,  // WORK ON LOCALS
      //httpOnly: false **********FOR DEPLOYMENT
      httpOnly: true, //we are not using https WORK ON LOCALS
      maxAge: 360000, //session time
      //secure: true, **********FOR DEPLOYMENT
    },
    rolling: true,
  })
);

// default value for title local
const projectName = "project-management-server";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const post = require("./routes/post");
app.use("/", post);

const auth = require ("./routes/auth");
app.use("/", auth);

const user = require ("./routes/user");
app.use("/", user);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
