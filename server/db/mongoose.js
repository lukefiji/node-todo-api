const mongoose = require("mongoose");

// Use native promises for Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp"
);

module.exports = { mongoose };
