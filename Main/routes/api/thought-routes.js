const router = require('express').Router();
const { body } = require('express-validator');
const validateInput = require('../../middleware/validateInput');
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thought-controller');


router.route('/')
  .get(getThoughts)
  .post(
    [
      body('thoughtText').trim().isLength({ min: 1, max: 280 }).withMessage('Thought must be between 1 and 280 characters'),
      body('username').trim().notEmpty().withMessage('Username is required'),
    ],
    validateInput,
    createThought
  );


router.route('/:thoughtId')
  .get(getSingleThought)
  .put(
    [
      body('thoughtText').trim().isLength({ min: 1, max: 280 }).withMessage('Thought must be between 1 and 280 characters'),
    ],
    validateInput,
    updateThought
  )
  .delete(deleteThought);


router.route('/:thoughtId/reactions').post(addReaction);


router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;
