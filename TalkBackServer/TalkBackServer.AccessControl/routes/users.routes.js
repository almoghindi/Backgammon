import express from "express";
import { check } from "express-validator";
import {
  register,
  login,
  refresh,
  logout,
  // getAllUsers,
  // getAllUsersByIds,
} from "../controllers/users.controller.js";
const router = express.Router();

router.post(
  "/register",
  [
    check("username").not().isEmpty().isLength({ min: 3 }),
    check("password")
      .not()
      .isEmpty()
      .matches(/[a-zA-Z0-9]{8,30}/),
  ],
  register
);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
// router.get("/getAllUsers", getAllUsers);
// router.post("/getAllUsersByIds", getAllUsersByIds);

export default router;
