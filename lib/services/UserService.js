const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../controllers/users');
const User = require('../models/User');

module.exports = class UserService {
  static async createUser({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const newUser = await User.insert({
      email,
      passwordHash,
    });

    return newUser;
  }
};
