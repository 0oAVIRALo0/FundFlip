const User = require("../models/user.model");
const Account = require("../models/account.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { signupBody, signinBody, updateBody } = require("../validations/index");

const JWT_SECRET = process.env.JWT_SECRET;

const signupUser = async (req, res) => {
  try {
    const validationResult = signupBody.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(411).json({
        message: "Invalid input",
        errors: validationResult.error.errors,
      });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(411).json({ message: "Username already taken" });
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    const userId = user._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const signinUser = async (req, res) => {
  try {
    const validationResult = signinBody.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(411).json({
        message: "Invalid input",
        errors: validationResult.error.errors,
      });
    }

    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (!user) {
      return res.status(411).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const validationResult = updateBody.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(411).json({
        message: "Invalid input",
        errors: validationResult.error.errors,
      });
    }

    await User.updateOne({ _id: req.userId }, { $set: req.body });

    res.json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const bulkUser = async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const query = filter
      ? {
          $or: [
            { firstName: { $regex: filter, $options: "i" } },
            { lastName: { $regex: filter, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query);

    res.json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signupUser,
  signinUser,
  updateUser,
  bulkUser,
};
