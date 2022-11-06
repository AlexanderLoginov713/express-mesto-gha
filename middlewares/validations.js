const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const checkingUrl = (url) => {
  const validate = validator.isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequestError('Неправильный формат URL адреса');
};

module.exports.checkingLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.checkingCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkingUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.checkingUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.checkingUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(checkingUrl),
  }),
});

module.exports.checkingUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

module.exports.checkingCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(checkingUrl),
  }),
});

module.exports.checkingCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
