const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// Remove all todos
// Todo.remove({}).then(result => {
//   console.log(result);
// });

Todo.findOneAndRemove({ text: "Something to do" }).then(todo => {
  console.log(todo);
});

Todo.findByIdAndRemove("59581fd7fc85ef0d7507cee1").then(todo => {
  console.log(todo);
});
