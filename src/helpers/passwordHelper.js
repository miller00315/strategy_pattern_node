const Bcrypt = require('bcrypt');
const { promisify } = require('util');

const hashAsync = promisify(Bcrypt.hash);
const compareAsync = promisify(Bcrypt.compare);

const SALT_PWD = parseInt(process.env.SALT_PWD);

class Password {
  static hashPassword(pass) {
    return hashAsync(pass, SALT_PWD);
  }

  static comparePassword(pass, hash) {
    return compareAsync(pass, hash);
  }
}

module.exports = Password;
