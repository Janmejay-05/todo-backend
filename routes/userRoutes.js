const express = require("express");

const userRoutes = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

//register
userRoutes.post(
  "/register",
  [
    body("userName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      result.errors = result.errors.map((item) => {
        if (item.path == "userName") {
          item.msg = "enter your name";
          return item;
        }
        if (item.path == "email") {
          item.msg = "invalid email";
          return item;
        }
        if (item.path == "password") {
          item.msg = "invalid password";
          return item;
        }

        return item;
      });

      return res.status(400).json({ result });
    }

    try {
      const emailCheck = await userModel.find({ email: req.body.email });
      if (emailCheck.length !== 0) {
        return res.status(400).json({ message: "account already exist" });
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
      req.body.todolist = [];

      await userModel.insertOne(req.body);

      res.status(200).json({ message: "successful", result: req.body });
    } catch (err) {
      res.status(400).json({ message: "cannot create account" });
    }
  }
);

//login

userRoutes.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      result.errors = result.errors.map((item) => {
        if (item.path == "email") {
          item.msg = "invalid email";
          return item;
        }
        if (item.path == "password") {
          item.msg = "invalid password";
          return item;
        }

        return item;
      });

      return res.status(400).json({ result });
    }

    const { email, password } = req.body;
    try {
      const isAcc = await userModel.findOne({ email });
      if (!isAcc) {
        return res.status(400).json({ invalid: "wrong email" });
      }

      if (await bcrypt.compare(password, isAcc.password)) {
        const token = jwt.sign({ isAcc }, "jay", { expiresIn: "2h" });

        res.status(200).json({
          message: "successful",
          token,
        });
      } else {
        res.status(400).json({ invalid: "wrong password" });
      }
    } catch (err) {
      res.status(400).json({ message: "error" });
    }
  }
);

//email check
userRoutes.post("/email-check", [body("email").isEmail()], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    result.errors = result.errors.map((item) => {
      if (item.path == "email") {
        item.msg = "invalid email";
        return item;
      }
      return item;
    });

    return res.status(400).json({ result });
  }

  const { email } = req.body;
  console.log("email", email);
  try {
    const findEmail = await userModel.findOne({ email });
    console.log(findEmail);
    if (!findEmail) {
      return res.status(400).json({ message: "no email found" });
    }

    const otp = Math.floor(Math.random() * 9000) + 1000;
    res.json({ message: "successful", otp, email: findEmail.email });
  } catch (err) {
    res.status(400).json({ message: "error" });
  }
});

//update password

userRoutes.post(
  "/password-update",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      result.errors = result.errors.map((item) => {
        if (item.path == "email") {
          item.msg = "invalid email";
          return item;
        }

        if (item.path == "password") {
          item.msg = "invalid password";
          return item;
        }

        return item;
      });

      return res.status(400).json({ result });
    }

    const { email, password } = req.body;

    console.log("email", email, "password", password);
    try {
      const newpassword = await bcrypt.hash(password, 10);

      const findEmail = await userModel.findOneAndUpdate(
        { email },
        { password: newpassword }
      );
      console.log(findEmail);
      if (!findEmail) {
        return res.status(400).json({ message: "no email found" });
      }

      res.json({ message: "successful" });
    } catch (err) {
      res.status(400).json({ message: "error" });
    }
  }
);

module.exports = userRoutes;
