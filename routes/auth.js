var express = require("express");
var router = express.Router();
const User = require("../models/user");
const { check, validationResult, body } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name").isLength({ min: 3 }).withMessage("name must be of 3 char"),
    check("email").isEmail().withMessage("email is required"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("password should be of at least 5 char"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("email is required"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("password should be of at least 5 char"),
  ],
  signin
);

router.get("/signout", signout);
router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
