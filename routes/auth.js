const express = require("express");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("E-mail does not exists, please enter a valid one.");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Incorrect password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .custom((value, { req }) => {
        return User.findOne({ email: req.body.email }).then((userDoc) => {
          return bcrypt.compare(value, userDoc.password).then((doMatch) => {
            if (!doMatch) {
              return Promise.reject("Incorrect password");
            }
          });
        });
      })
      .trim(),
  ],
  authController.postLogin,
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail exists already, please pick a different one.");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters.",
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup,
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
