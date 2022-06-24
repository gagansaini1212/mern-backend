const User = require('../models/user');
const Order = require('../models/order');

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
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized to update this user',
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    },
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.user._id })
    .populate('user', '_id name')
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: 'No order in this account',
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      qauntity: product.qauntity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // Store this in DB
  User.findOneAndUpdate(
    {
      _id: req.profile._id,
    },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: 'Unbale to save purcahse list',
        });
      }
      next();
    },
  );
};
