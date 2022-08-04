const router = require('express').Router();
const tokenExtractor = require('../util/tokenExtractor');

const { ReadingList } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await ReadingList.findAll({});
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const readingItem = await ReadingList.create(req.body);
  return res.json(readingItem);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingItem = await ReadingList.findByPk(req.params.id);
  if (readingItem.userId !== req.decodedToken.id) {
    return res.status(401).end();
  }
  readingItem.read = req.body.read;
  await readingItem.save();
  res.json(readingItem);
});

module.exports = router;
