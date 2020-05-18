const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user fonud",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "No users in DB",
      });
    }
    res.json(users);
  });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, usefindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Not authorized to update",
        });
      }
      req.profile.salt = undefined;
      req.profile.encry_password = undefined;
      req.profile.createdAt = undefined;
      req.profile.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req,res)=>{
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error: "No orders for this user"
            })
        }
        return res.json(order);
    })
}

exports.pushOrdersInPurchaseList = (req,res,next)=>{
    let purchases = []
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    });
    //now store the list in db
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},//this new equal to true send a updated object from db
        (err, purchases)=>{
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchases list"
                })
            }
            return res.json({
                msg:"order added successfully!"
            });
            next();
        }
    )
}