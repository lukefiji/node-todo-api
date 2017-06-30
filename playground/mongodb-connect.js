// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectId } = require("mongodb");

// Takes two arguments
// -- URL using mongodb protocol
// -- Callback
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) return console.log("Unable to connect to MongoDB server.");

  console.log("Connected to MongoDB Server.");

  // Don't need to create collection first
  db.collection("Todos").insertOne({
    text: "Something to do",
    completed: false
  }, (err, result) => {
    if (err) return console.log("Unable to insert todo:", err);

    // ops attiribute store all docs that were inserted
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  // Insert new doc into Users (name, age, location)
  db.collection("Users").insertOne({
    name: "Luke",
    age: 25,
    location: "Los Angeles"
  }, (err, result) => {
    if (err) return console.log("Unable to insert user:", err);

    console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  });

  // Close connection to MongoDB
  db.close();
});
