const mongoose = require("mongoose");
const logger = require("@shared/logger")("database");

async function connectDb(uri) {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  logger.info("Connected to Database");
}

module.exports = connectDb;
