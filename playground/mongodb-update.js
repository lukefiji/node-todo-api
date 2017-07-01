// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectId } = require("mongodb");

// Takes two arguments
// -- URL using mongodb protocol
// -- Callback
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) return console.log("Unable to connect to MongoDB server.");

  console.log("Connected to MongoDB Server.");

  // findOneAndUpdate
  // db
  //   .collection("Todos")
  //   .findOneAndUpdate(
  //     { _id: ObjectId("5955a2dfd40097e9236f65da") },
  //     {
  //       $set: {
  //         completed: true
  //       }
  //     },
  //     { returnOriginal: false }
  //   )
  //   .then(result => {
  //     console.log(result);
  //   });

  db
    .collection("Users")
    .findOneAndUpdate(
      { _id: ObjectId("5955a2de04e736e8e7adeda8") },
      {
        $set: {
          name: "kidfiji.net"
        },
        $inc: {
          age: 1
        }
      },
      { returnOriginal: false }
    )
    .then(result => {
      console.log(result);
    });

  db.close();
});
