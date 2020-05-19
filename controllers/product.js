const Product = require("../models/product");
const formidable = require("formidable");
// const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "No product fonud!",
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
        error: "Problem with image upload!",
      });
    }
    //destructure the fields
    const { name, description, price, category, stock } = fields;
    //we can even use express-validator
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "please include all fields",
      });
    }

    let product = new Product(fields);
    if (file.photo) {
      if (file.photo.size > 5000000) {
        return res.status(400).json({
          error: "file size is greater than 5MB",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "saving product is failed!",
        });
      }
      res.json(product);
    });
  });
};
