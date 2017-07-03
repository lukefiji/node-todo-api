require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { ObjectID } = require("mongodb");

// Import models
const { Todo } = require("./models/todo");
const { User } = require("./models/user");

// Import middleware
const { authenticate } = require("./middleware/authenticate");

const app = express();
const PORT = process.env.PORT;

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

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      // If todo doesn't exist
      if (!todo) res.status(404).send();

      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  // _.pick() pulls out properties from objects if they exist
  // -- Only pulls 'text' and 'completed' fields from request
  const body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  // if boolean and is true
  if (_.isBoolean(body.completed) && body.completed) {
    // Set completed at time if todo is completed
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null; // Remove completion time
  }

  // $new returns modified document
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) return res.status(404).send();

      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.post("/users", (req, res) => {
  // Pick out only email and password fields in the POST request
  const body = _.pick(req.body, ["email", "password"]);

  // Create a new user from the picked requests
  const user = new User(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      // 'x-' is a prefix for custom headers
      res.header("x-auth", token).send(user);
    })
    .catch(e => res.status(400).send(e));
});

// Private route
app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Export server for testing
module.exports = { app };
