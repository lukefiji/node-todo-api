const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { ObjectID } = require("mongodb");

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
  // Get all todos
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// GET /todos/:id
app.get("/todos/:id", (req, res) => {
  // Collecting id from request
  const id = req.params.id;

  // If id is invalid - 404 not found
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findById(id)
    .then(todo => {
      // If id is valid but todo isn't found
      if (!todo) res.status(404).send();

      // If todo is found
      // -- Object so you can add additional properties
      res.send({ todo });
    })
    // If error - send 400 Bad Request
    .catch(e => res.status(400).send());
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// Export server for testing
module.exports = { app };
