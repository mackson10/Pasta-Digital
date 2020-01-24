const mongoose = require("mongoose");
const config = require("./config");

module.exports = function createConnection() {
  return mongoose.connect(config.mongoConnString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};
