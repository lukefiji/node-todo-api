const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const password = "123abc!";

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

const hashedPassword =
  "$2a$10$6zmPgr9rwX9FIxG7nxvb.ef/rfmJK7Nc6G3KHglNCv7nBElA2dTOy";
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

// const data = {
//   id: 10
// };

// const token = jwt.sign(data, "123abc");
// console.log(token);

// const decoded = jwt.verify(token, "123abc");
// console.log(decoded);

// const message = "I am user: Luke";
// const hash = SHA256(message).toString();

// console.log("Message ", message);
// console.log("Hash:", hash);

// const data = {
//   id: 4
// };

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "secretSaltText").toString()
// };

// const resultHash = SHA256(
//   JSON.stringify(token.data) + "secretSaltText"
// ).toString();

// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("Data was changed. Don't trust!");
// }
