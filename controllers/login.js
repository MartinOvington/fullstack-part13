const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { PASSWORD, SECRET } = require('../util/config');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/', async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === PASSWORD;

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  if (user.disabled) {
    return response.status(401).json({ error: 'account is disabled' });
  }
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  const session = await Session.findOne({ where: { userId: user.id } });

  if (!session) {
    const newSession = {
      userId: user.id,
      token: token,
    };
    await Session.create(newSession);
  } else {
    session.token = token;
    await session.save();
  }

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
