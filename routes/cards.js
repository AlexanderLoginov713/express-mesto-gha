const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  checkingCreateCard,
  checkingCardId,
} = require('../middlewares/validations');

router.post('/', checkingCreateCard, createCard);
router.get('/', getCards);
router.delete('/:cardId', checkingCardId, deleteCard);
router.put('/:cardId/likes', checkingCardId, likeCard);
router.delete('/:cardId/likes', checkingCardId, dislikeCard);

module.exports = router;
