const { Router } = require('express');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router().post('/sessions', async (req, res, next) => {
  try {
    await UserService.createUser(req.body);
    const sessionToken = await UserService.signIn(req.body);
    res
      .cookie(process.env.COOKIE_NAME, sessionToken, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .json({ message: 'Signed in successfully' });
  } catch (e) {
    next(e);
  }
});
