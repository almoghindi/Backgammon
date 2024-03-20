import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error.js";
import User from "../models/user.js";
import Token from "../models/token.js";

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
    res.status(400).send({ error: "User already exists, please login" });
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
    const error = new HttpError("Wrong credentials, please try again", 401);
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
    const error = new HttpError("Wrong credentials, please try again", 401);
    return next(error);
  }
  const refreshToken = generateRefreshToken(existingUser._id);
  const token = generateToken(existingUser._id);

  res.status(200).json({
    userId: existingUser._id,
    username: existingUser.username,
    token,
    refreshToken,
  });
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY);

  if (!payload) {
    return next(new HttpError("Invalid refresh token", 401));
  }

  const accessToken = generateToken(payload.userId);
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
