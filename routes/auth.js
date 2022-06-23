const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { signout, signup, signin, isSignedIn } = require('../controllers/auth');

router.post(
  '/signup',
  [
    check('name', 'Name should be atlest 3 charater long').isLength({ min: 3 }),
    check('email', 'Email is required').isEmail(),
    check(
      'password',
      'Password is required with atleeast 3 char long',
    ).isLength({ min: 3 }),
  ],
  signup,
);

router.post(
  '/signin',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password field is required').isLength({ min: 1 }),
  ],
  signin,
);

router.get('/signout', signout);

router.get('/testroute', isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
