const express = require('express');
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory,
} = require('../controllers/category');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// params
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

// Actual routes goes below

// Create categories

router.post(
  '/category/create/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory,
);

// Read categoies

router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategory);

// Update category

router.put(
  '/category/:categoryId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory,
);

// Delete category

router.delete(
  '/category/:categoryId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory,
);

module.exports = router;
