const express = require("express");
require("express-async-errors");
const passport = require("passport");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const compression = require("compression");
const actuator = require("express-actuator");
const cors = require("cors");

const { NotFoundError } = require("@shared/errors");
const { errorHandler } = require("@shared/middlewares");
const v1Router = require("./routes/v1");

const cookieKeys = process.env.COOKIE_KEYS.split(",");
const app = express();

app.use(cors());

// production specific
app.use(helmet());
app.use(compression());
app.use(actuator());

// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "token",
    keys: cookieKeys,
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// configure passport
passport.initialize();
require("./config/passport");

// routers
app.use("/api/v1", v1Router);

// handler for unknown routes
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;
