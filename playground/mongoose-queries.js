const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// const id = "5957284efa0bbd5226415d511";

// if (!ObjectID.isValid(id)) {
//   console.log("ID not valid");
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log("Todos", todos);
// });

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log("Todo", todo);
// });

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) {
//       return console.log("Id not found");
//     }
//     console.log("Todo By Id", todo);
//   })
//   // If todo is invalid
//   .catch(e => console.log(e));

const userId = "59572d0bfc85ef0d7507cee0";

User.findById(userId)
  .then(user => {
    // If user isn't found
    if (!user) return console.log("User not found");

    // If user is found
    console.log("User by Id", user);
  })
  // If there are any errors
  .catch(e => console.log(e));
