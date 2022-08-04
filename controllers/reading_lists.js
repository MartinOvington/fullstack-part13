const router = require('express').Router();

const { ReadingList } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await ReadingList.findAll({});
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const readingItem = await ReadingList.create(req.body);
  return res.json(readingItem);
});

module.exports = router;
