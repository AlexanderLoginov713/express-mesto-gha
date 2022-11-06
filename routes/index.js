const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

const { createUser, login } = require('../controllers/users');

const {
  checkingCreateUser,
  checkingLogin,
} = require('../middlewares/validations');

router.post('/signup', checkingCreateUser, createUser);
router.post('/signin', checkingLogin, login);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));
router.use((req, res, next) => {
  next(new UnauthorizedError('Для доступа требуется авторизация'));
});

module.exports = router;
