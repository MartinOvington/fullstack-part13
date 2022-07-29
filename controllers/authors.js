const router = require('express').Router();
const sequelize = require('sequelize');
const { Op } = require('sequelize');

const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('count', sequelize.col('id')), 'articles'],
      [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
    ],
    group: ['author'],
    order: sequelize.literal('likes DESC'),
  });
  res.json(authors);
});

module.exports = router;
