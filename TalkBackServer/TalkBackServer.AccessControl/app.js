import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();
import HttpError from "./models/HttpError.js";

import UsersRoutes from "./routes/UsersRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", UsersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.MONGO_URI + "-AccessControl")
  .then(() => {
    app.listen(process.env.ACCESS_CONTROL_PORT || 5001);
  })
  .catch((err) => console.log(err));
