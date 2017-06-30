// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectId } = require("mongodb");

// Takes two arguments
// -- URL using mongodb protocol
// -- Callback
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) return console.log("Unable to connect to MongoDB server.");

  console.log("Connected to MongoDB Server.");

  // find() returns a MongoDB cursor
  // toArray() returns array of documents from cursor (a promise)
  db.collection("Users").find({ name: "Luke" }).toArray().then(
    docs => {
      console.log("Users:");
      console.log(JSON.stringify(docs, undefined, 2));
    },
    err => {
      console.log("Unable to fetch todos:", err);
    }
  );

  db.close();
});
