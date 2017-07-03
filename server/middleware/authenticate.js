const { User } = require("./../models/user");

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header("x-auth");

  User.findByToken(token)
    .then(user => {
      // If user hasn't been found
      if (!user) {
        // Go straight to catch
        return Promise.reject();
      }

      // Modify request & token to make accessible on request argument
      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      res.status(401).send();
    });
};

module.exports = { authenticate };
