const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { INCORRECT_DATA_ERROR, NO_DATA_ERROR, DEFAULT_ERROR } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(NO_DATA_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  return User.findOneAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'NotFound') {
        res.status(NO_DATA_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findOneAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.message === 'NotFound') {
        res.status(NO_DATA_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
