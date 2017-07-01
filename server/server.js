const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");

// Import models
const { Todo } = require("./models/todo");
const { User } = require("./models/user");

const app = express();

// Use body-parser to send json to Express app
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  // Collect text data from body request
  const todo = new Todo({
    text: req.body.text
  });

  // Save todo
  todo.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      // Send an error with 400 status (Bad Request)
      res.status(400).send(e);
    }
  );
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// Export server for testing
module.exports = { app };
