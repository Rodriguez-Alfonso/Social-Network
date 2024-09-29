const { User, Thought } = require('../models');

const handleErrors = (res, err) => {
  console.log(err);
  res.status(500).json(err);
};

const userNotFoundResponse = (res) => {
  res.status(404).json({ message: 'No user with this id!' });
};

const userController = {
  async getUsers(req, res) {
    try {
      const users = await User.find().select('-__v');
      res.json(users);
    } catch (err) {
      handleErrors(res, err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId)
        .select('-__v')
        .populate('friends thoughts');

      user ? res.json(user) : userNotFoundResponse(res);
    } catch (err) {
      handleErrors(res, err);
    }
  },

  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      handleErrors(res, err);
    }
  },

  async updateUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { runValidators: true, new: true }
      );

      updatedUser ? res.json(updatedUser) : userNotFoundResponse(res);
    } catch (err) {
      handleErrors(res, err);
    }
  },

  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);

      if (!deletedUser) {
        return userNotFoundResponse(res);
      }

      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      res.json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
      handleErrors(res, err);
    }
  },

  async modifyFriend(req, res, operation) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { [operation]: { friends: req.params.friendId } },
        { new: true }
      );

      updatedUser ? res.json(updatedUser) : userNotFoundResponse(res);
    } catch (err) {
      handleErrors(res, err);
    }
  },

  addFriend(req, res) {
    return this.modifyFriend(req, res, '$addToSet');
  },

  removeFriend(req, res) {
    return this.modifyFriend(req, res, '$pull');
  },
};

module.exports = userController;