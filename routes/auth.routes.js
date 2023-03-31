const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
require("dotenv").config();
const router = Router();

router.post(
  "/login",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password shouldn't be empty").isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Not valid login or password",
        });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Not correct password or email" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.secret, {
        expiresIn: "1h",
      });
      res.json({
        token,
        userId: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/registration",
  [
    check("email", "Enter a valid email").isEmail(),
    check("name", "Enter valid name").isString(),
    check("password", "Password shouldn't be empty").isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Not valid data",
        });
      }
      const { email, name, password } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ message: "The current user had an account" });
      }

      const hashPassword = await bcrypt.hash(password, 12);
      const createUser = new User({
        email,
        name,
        password: hashPassword,
      });
      await createUser.save();

      const token = jwt.sign({ userId: user.id }, process.env.secret, {
        expiresIn: "1h",
      });
      res.status(201).json({ message: "User is created", token, name, email });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/registrationSocial",
  [
    check("name", "Enter a valid name").isString(),
    check("email", "Enter a valid email").isEmail(),
    check("image", "Enter valid image").isString(),
    check("bySocial", "Social aren't valid").isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Not valid data",
        });
      }
      const { name, email, image, bySocial } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({
            message: "The current user had an account with the same email",
          });
      }

      const createUser = new User({
        name,
        email,
        image,
        loginedByGitHub: bySocial === "github",
        loginedByFacebook: bySocial === "facebook",
        loginedByGoogle: bySocial === "google",
      });

      await createUser.save();
      res.status(201).json({ message: "User is created", name, email, image });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/update",
  [
    check("name", "Enter a valid name").isString(),
    check("image", "Choose a valid image").isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Not valid name or img",
        });
      }
      const { name, image, email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      await User.updateOne({ email }, { $set: { name, image: image } });

      res.status(202).json({
        message: "User is updated",
        name,
        image,
      });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/find",
  [check("data", "Not valid id").isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Not valid id",
        });
      }
      const { id } = req.body;

      const user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.secret, {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "User exist",
        token,
        name: user.name,
        image: user.image,
      });
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

module.exports = router;
