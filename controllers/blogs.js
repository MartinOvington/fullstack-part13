const router = require('express').Router();

const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();

  console.log(blogs.map((b) => JSON.stringify(b)));
  res.json(blogs);
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const blog = await Blog.create(req.body);
  return res.json(blog);
});

/*
router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog && req.body.likes) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog)
  } else {
    res.status(404).end();
  }
});
*/
router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(req.blog);
    Blog.destroy({ where: { id: req.blog.id } });
    return res.json(req.blog);
  } else {
    return res.status(404).end();
  }
});

module.exports = router;
