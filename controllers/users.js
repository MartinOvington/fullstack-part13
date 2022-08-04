const router = require('express').Router();

const { request } = require('express');
const { User, Blog, ReadingList } = require('../models');

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } });
  next();
};

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: { model: Blog, attributes: { exclude: ['userId'] } },
  });

  res.json(users);
});

router.get('/:id', async (req, res) => {
  const users = await User.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: [],
        },
      },
    ],
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
  });

  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  return res.json(user);
});

router.put('/:username', userFinder, async (req, res) => {
  req.user.username = req.body.username;
  await req.user.save();
  res.json(req.user);
});

router.delete('/:username', userFinder, async (req, res) => {
  if (req.user) {
    await User.destroy({ where: { username: req.user.username } });
    return res.json(req.user);
  } else {
    return res.status(404).end();
  }
});

module.exports = router;
