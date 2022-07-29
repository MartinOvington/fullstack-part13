const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { Blog, User } = require('../models');
const { SECRET } = require('../util/config');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: { model: User, attributes: ['name', 'username'] },
  });

  console.log(blogs.map((b) => JSON.stringify(b)));
  res.json(blogs);
});

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  console.log(authorization);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      res.status(401).json({ error: 'token invalid' });
    }
  } else {
    res.status(401).json({ error: 'token missing' });
  }
  next();
};

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
