import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  try {
    const userToken = req.header("authorization");
    if (!userToken) return res.status(401).json({ error: "unauthorization" });
    const token = userToken.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(payload)
    if (!payload) return res.status(401).json({ error: "unauthorization" });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "EXP" });
  }
};