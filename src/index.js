require("module-alias/register");

const { connectDb, checkEnv } = require("./config/startup");
const logger = require("@shared/logger")("index");
const app = require("@app");

// listen and log unexpected errors
process.on("uncaughtExceptionMonitor", (err) => {
  logger.error("Uncaught Exception");
  logger.error(err);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection");
  logger.error(err);
  process.exit(1);
});

checkEnv(
  "PORT",
  "MONGO_URI",
  "JWT_PRIVATE_KEY",
  "JWT_PUBLIC_KEY",
  "JWT_EXPIRES_IN",
  "JWT_ALGORITHM",
  "JWT_NAME",
  "COOKIE_KEYS",
  "LOGGLY_TOKEN",
  "LOGGLY_SUBDOMAIN"
);

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT;

const start = async () => {
  logger.info("Starting server");

  await connectDb(mongoUri);

  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
};

start();
