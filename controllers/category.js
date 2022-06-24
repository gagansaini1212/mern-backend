const category = require('../models/category');
const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'Catrgory not found in DB',
      });
    }
    req.category = category;
  });
  next();
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'Not able to save category in DB',
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: 'Ooops! No category found in DB',
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  // getting category from middleware getCategoryById --> 11
  const category = req.category;
  // then updaing that category name here
  category.name = req.category.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to update category',
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to delete category',
      });
    }
    res.json({
      message: `Successfully deleted ${category.name}`,
    });
  });
};
