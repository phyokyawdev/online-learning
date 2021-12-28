const express = require("express");
require("express-async-errors");
const passport = require("passport");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const compression = require("compression");
const actuator = require("express-actuator");

const { NotFoundError } = require("@shared/errors");
const { errorHandler } = require("@shared/middlewares");
const v1Router = require("./routes/v1");

const cookieName = process.env.COOKIE_NAME;
const cookieKeys = process.env.COOKIE_KEYS.split(",");
const app = express();

// production specific
app.use(helmet());
app.use(compression());
app.use(actuator());

// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: cookieName,
    keys: cookieKeys,
  })
);

// configure passport
passport.initialize();
require("./config/passport");

// routers
app.use("/v1", v1Router);

// handler for unknown routes
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;
