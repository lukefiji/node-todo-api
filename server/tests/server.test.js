const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

// Testing lifecycle method
// -- Runs before every test case
beforeEach(populateUsers);
beforeEach(populateTodos);

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
        Todo.find({ text })
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
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e)); // Throw error /w any errors on finding todos
      });
  });
});

describe("/GET todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("/GET todos/:id", () => {
  it("should return todo doc", done => {
    request(app)
      // toHexString() converts ObjectID to a string
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return a 404 if todo not found", done => {
    // Create new valid ObjectID
    const fakeHexId = new ObjectID().toHexString();

    request(app).get(`/todos/${fakeHexId}`).expect(404).end(done);
  });

  it("should return 404 for non-object ids", done => {
    request(app).get("/todos/123abc").expect(404).end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      // After todo has been deleted
      .end((err, res) => {
        if (err) return done(err);

        // Run query to find the todo
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return 404 if todo not found", done => {
    const fakeHexId = new ObjectID().toHexString();

    request(app).delete(`/todos/${fakeHexId}`).expect(404).end(done);
  });

  it("should return 404 if object id is invalid", done => {
    request(app).delete("/todos/123abc").expect(404).end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the todo", done => {
    // Grab id of first mock todo item
    const hexId = todos[0]._id.toHexString();

    // New body to send patch
    const body = { text: "New text", completed: true };

    // Update text, set completed true
    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      // You can also test against req.body
      .end((err, res) => {
        if (err) return done(err);

        Todo.findById(hexId)
          .then(todo => {
            expect(todo.text).toBe("New text");
            expect(todo.completed).toBe(true);
            expect(todo.completedAt).toBeA("number");
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should should clear completedAt when todo is not completed", done => {
    // Grab id of second mock todo item
    const hexId = todos[1]._id.toHexString();
    const body = { text: "Changed second todo", completed: false };

    // Update text, set completed to false
    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      // You can also test against db query
      .expect(res => {
        expect(res.body.todo.text).toBe("Changed second todo");
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 if unauthenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        // toEqual() for objects
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", done => {
    const email = "example@example.com";
    const password = "123mnb!";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      // Query the database
      .end(err => {
        if (err) return done(err);

        User.findOne({ email }).then(user => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it("should return validation errors if request invalid", done => {
    request(app)
      .post("/users")
      .send({ email: "email.com", password: "123" })
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", done => {
    request(app)
      .post("/users")
      .send({ email: users[0].email, password: "abc123" })
      .expect(400)
      .end(done);
  });
});
