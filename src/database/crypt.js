const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = function (plaintextPassword){
  return bcrypt.hash(plaintextPassword, saltRounds);
};

const comparePassword = function(plaintextPassword, hashedPassword){
  return bcrypt.compare(plaintextPassword, hashedPassword);
};
module.exports = {
  hashPassword,
  comparePassword
};
