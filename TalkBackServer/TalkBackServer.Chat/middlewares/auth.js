import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  try {
    const userToken = req.header("authorization");
    if (!userToken) return res.status(401).json({ error: "unauthorization" });
    const token = userToken.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!payload) return res.status(401).json({ error: "unauthorization" });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "EXP" });
  }
};

export const socketAuth = (token, next) => {
  try {
    console.log("token  " + token);
    console.log(process.env.JWT_SECRET_KEY);
    if (!token) next(new Error("unauthorized"));
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("payload " + payload);
    if (!payload) next(new Error("unauthorized"));
    next();
  } catch (err) {
    next(err);
  }
};
