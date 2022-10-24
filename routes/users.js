const router = require('express').Router();
const {
  createUser,
  getUsers
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
module.exports = router;