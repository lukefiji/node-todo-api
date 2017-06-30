const mongoose = require("mongoose");

// Use native promises for Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

module.exports = { mongoose };
