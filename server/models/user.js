const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// Instance methods

// Override method, so the server won't respond back /w password & tokens
userSchema.methods.toJSON = function() {
  const user = this;

  // .toObject() turns Mongoose variable into object
  const userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

// Regular function to bind 'this'
userSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = "auth";
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();

  user.tokens.push({ access, token });

  return user.save().then(() => {
    // Success argument for next '.then()' call
    return token;
  });
};

userSchema.methods.removeToken = function(token) {
  const user = this;

  // Return for usage in a promise
  return user.update({
    // Pulls the whole token object
    $pull: {
      tokens: { token }
    }
  });
};

// '.statics' turns into a Model method
userSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, "abc123");
  } catch (e) {
    // Reject promise to prevent success case
    return Promise.reject();
  }

  // Allows a '.then()' to findByToken
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

userSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  return User.findOne({ email }).then(user => {
    if (!user) return Promise.reject();

    // Return as a promise because bcrypt only supports callbacks
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// Middleware - before save
userSchema.pre("save", function(next) {
  const user = this;

  if (user.isModified("password")) {
    // Generate a 10-round salt /w bcrypt
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        // Set user password to generated hash
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
