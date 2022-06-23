const User = require('../models/user');

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'No user was found in DB',
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.updatedAt = undefined;
  req.profile.createdAt = undefined;

  return res.json(req.profile);
};

// If you want to return whole lot of things in array without any restriction.
// Not good idea to public all of your users

// exports.getAllUsers = (req, res) => {
//   User.find().exec((err, users) => {
//     if (err || !users) {
//       return res.status(400).json({
//         error: 'Ooops! No users found',
//       });
//     }
//     res.json(users);
//   });
// };

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'You are not authorize to update this user',
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    },
  );
};
