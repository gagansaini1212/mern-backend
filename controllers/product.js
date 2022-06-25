const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const Product = require('../models/product');

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: 'Product not found in DB',
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: 'problem with image',
      });
    }

    // destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      res.status(400).json({
        error: 'Please include all the fields',
      });
    }

    let product = new Product(fields);

    // handle photo and file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: 'File size is too big!',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to the db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: 'Not able to save product',
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// update controller

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: 'problem with image',
      });
    }

    // updation product
    let product = req.product;
    product = _.extend(product, fields);

    // handle photo and file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: 'File size is too big!',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to the db
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: 'Updation of the product failed',
        });
      }
      res.json(product);
    });
  });
};

// delete controller

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: 'Failed to delete product',
      });
    }
    res.json({
      message: 'Product removed successfully!',
      deletedProduct,
    });
  });
};
