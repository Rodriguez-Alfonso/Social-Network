const { Thought, User } = require('../models');

const thoughtController = {
 

 
  async updateThought(req, res, next) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        const error = new Error('No thought with this id!');
        error.statusCode = 404;
        throw error;
      }

      res.json(updatedThought);
    } catch (err) {
      next(err);
    }
  },

  
  async deleteThought(req, res, next) {
    try {
      const deletedThought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!deletedThought) {
        const error = new Error('No thought with this id!');
        error.statusCode = 404;
        throw error;
      }

      const updatedUser = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!updatedUser) {
        const error = new Error('Thought deleted but no user with this id!');
        error.statusCode = 404;
        throw error;
      }

      res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      next(err);
    }
  },

  
};

module.exports = thoughtController;