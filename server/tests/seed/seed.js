const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: "luke@example.com",
    password: "useOnePass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, "abc123").toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "luke2@example.com",
    password: "useTwoPass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userTwoId, access: "auth" }, "abc123").toString()
      }
    ]
  }
];

// Create sample todos
const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo",
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }
];

const populateTodos = done => {
  // Delete all todos
  Todo.remove({})
    .then(() => {
      // Insert several todos
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      // Waits for multiple promises to all complete
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };
