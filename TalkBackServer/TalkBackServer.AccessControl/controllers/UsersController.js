import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import HttpError from "../models/HttpError.js";
import User from "../models/User.js";
import Token from "../models/Token.js";

import {
  generateToken,
  verifyToken,
  generateRefreshToken,
} from "../utils/jwt.js";

export const register = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("Registration failed", 500);
    return next(error);
  }

  if (existingUser) {
    res.send({ error: "User already exists, please login" });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Registration failed", 500);
    return next(error);
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    const error = new HttpError("User creation failed failed", 500);
    return next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("Login failed", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Wrong credentials, please try again", 500);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Login failed", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Wrong credentials, please try again", 500);
    return next(error);
  }
  const refreshToken = generateRefreshToken(existingUser._id);
  const token = generateToken(existingUser._id);
  // let existingToken;
  // try {
  //   existingToken = await Token.findOne({ userId: existingUser._id });
  // } catch (err) {
  //   const error = new HttpError("Login failed", 500);
  //   return next(error);
  // }

  // let token;
  // if (existingToken && verifyToken(existingToken.token)) {
  //   token = existingToken.token;
  // }
  // if (existingToken && !verifyToken(existingToken.token)) {
  //   try {
  //     await Token.deleteOne({ userId: existingUser._id });
  //   } catch (err) {
  //     const error = new HttpError("Token deleting failed", 500);
  //     return next(error);
  //   }
  // }

  // if (!existingToken || !verifyToken(existingToken.token)) {
  //   token = generateToken(existingUser._id);
  //   try {
  //     const createdToken = new Token({
  //       userId: existingUser._id,
  //       token: token,
  //     });
  //     await createdToken.save();
  //   } catch (err) {
  //     const error = new HttpError("Token saving failed", 500);
  //     return next(error);
  //   }
  // }
  res.status(200).json({
    userId: existingUser._id,
    username: existingUser.username,
    token,
    refreshToken,
  });
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
  if (!payload) {
    return next(new HttpError("Invalid refresh token", 401));
  }

  const accessToken = generateAccessToken(payload.userId);
  res.status(200).json({ accessToken });
};

export const logout = async (req, res, next) => {
  const { userId } = req.body;
  try {
    await Token.deleteOne({ userId: userId });
  } catch (err) {
    const error = new HttpError("Logout failed", 500);
    return next(error);
  }
  res.status(200).json({ message: "Logout successful" });
};

// export const getAllUsers = async (req, res, next) => {
//   let users;
//   try {
//     users = await User.find();
//   } catch (err) {
//     const error = new HttpError("Fetching users failed", 500);
//     return next(error);
//   }
//   res
//     .status(200)
//     .json({ users: users.map((user) => user.toObject({ getters: true })) });
// };

// export const getAllUsersByIds = (req, res, next) => {
//   const { userIds } = req.body;
//   console.log(userIds);
//   let users;
//   try {
//     users = User.find({ _id: { $in: userIds } });
//   } catch (err) {
//     const error = new HttpError("Fetching users failed", 500);
//     return next(error);
//   }
//   console.log(users);
//   res
//     .status(200)
//     .json({ users: users.map((user) => user.toObject({ getters: true })) });
// };
