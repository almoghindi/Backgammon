import Jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  try {
    const userToken = req.header("authorization");
    if (!userToken) return res.status(401).json({ error: "unauthorization" });
    const token = userToken.split(" ")[1];
    const payload = Jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!payload) return res.status(401).json({ error: "unauthorization" });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "EXP" });
  }
};
