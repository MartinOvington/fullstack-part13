const router = require('express').Router();

const { Session } = require('../models');

const tokenExtractor = require('../util/tokenExtractor');

router.delete('/', tokenExtractor, async (req, res) => {
  await Session.destroy({ where: { userId: req.decodedToken.id } });
  res.sendStatus(200);
});

module.exports = router;
