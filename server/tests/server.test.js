const expect = require("expect");
const request = require("supertest");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

// Testing lifecycle method
// -- Runs before every test case
beforeEach(done => {
  // Delete all todos
  Todo.remove({}).then(() => done());
});

describe("POST /todos", () => {
  // Done() parameter for async tests
  it("should create a new todo", done => {
    const text = "Test todo text";

    request(app)
      .post("/todos") // Send post request via supertest
      .send({ text }) // Send data
      .expect(200)
      // Custom expect call
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        // Handle errors
        if (err) return done(err);

        // Fetch all todos from collection
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e)); // Throw error if no Todo found
      });
  });

  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .send({}) // Send empty post body
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(0);
            done();
          })
          .catch(e => done(e)); // Throw error /w any errors on finding todos
      });
  });
});
