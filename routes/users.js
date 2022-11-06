const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const {
  checkingUserId,
  checkingUpdateUser,
  checkingUpdateAvatar,
} = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/users/me', getUser);
router.get('/users/:userId', checkingUserId, getUserById);
router.patch('/me', checkingUpdateUser, updateUser);
router.patch('/me/avatar', checkingUpdateAvatar, updateAvatar);

module.exports = router;
