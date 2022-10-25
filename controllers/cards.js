const Card = require('../models/card');
const { INCORRECT_DATA_ERROR, NO_DATA_ERROR, DEFAULT_ERROR } = require('./utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(NO_DATA_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.message === 'NotFound') {
        res.status(NO_DATA_ERROR).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.message === 'NotFound') {
        res.status(NO_DATA_ERROR).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
