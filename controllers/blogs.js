const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { Op } = require('sequelize');
const tokenExtractor = require('../util/tokenExtractor');

const { Blog, User } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  const where = req.query.search
    ? {
        [Op.or]: {
          title: { [Op.iLike]: `%${req.query.search}%` },
          author: { [Op.iLike]: `%${req.query.search}%` },
        },
      }
    : {};

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: { model: User, attributes: ['name', 'username'] },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
});

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  console.log(req.blog, req.decodedToken);
  if (req.blog) {
    if (
      !req.blog.userId ||
      (req.decodedToken.id && req.blog.userId == req.decodedToken.id)
    ) {
      await Blog.destroy({ where: { id: req.blog.id } });
      return res.json(req.blog);
    } else {
      return res.status(401).end();
    }
  } else {
    return res.status(404).end();
  }
});

module.exports = router;
