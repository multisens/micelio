const bcrypt = require('bcrypt');

const PASSWORD_ROUNDS = 10;

const generatePassword = (password) => {
  return bcrypt.hashSync(password, PASSWORD_ROUNDS);
}

const isPasswordValid = (hashedPassword, password) => {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  generatePassword,
  isPasswordValid
}
