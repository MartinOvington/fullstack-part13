const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const { SECRET } = require('../util/config');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  console.log(authorization);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  const session = await Session.findOne({
    where: { userId: req.decodedToken.id },
  });

  if (!session) {
    return res.status(401).json({ error: 'invalid session' });
  }
  next();
};

module.exports = tokenExtractor;
