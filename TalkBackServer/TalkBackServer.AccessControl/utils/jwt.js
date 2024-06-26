import jwt from "jsonwebtoken";
import HttpError from "../models/http-error.js";

export const generateToken = (userId) => {
  let token;
  try {
    token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    });
  } catch (err) {
    throw new HttpError("Failed to generate token", 500);
  }
  return token;
};

export const generateRefreshToken = (userId) => {
  let token;
  try {
    token = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
  } catch (err) {
    throw new HttpError("Failed to generate token", 500);
  }
  return token;
};

export const verifyToken = (token, secret) => {
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    return false;
  }
  return payload;
};
