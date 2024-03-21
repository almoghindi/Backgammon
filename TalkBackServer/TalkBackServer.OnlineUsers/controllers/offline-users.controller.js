import OfflineUser from "../models/offline-user.js";
import { deleteOnlineUser } from "./online-users.controller.js";
export const getOfflineUsers = async (req, res, next) => {
  let offlineUsers;

  try {
    offlineUsers = await OfflineUser.find();
  } catch (err) {
    return console.log(err);
  }
  if (!offlineUsers) {
    return res.status(404).json({ message: "No offline users found" });
  }
  return res.status(200).json({ offlineUsers });
};

export const postOfflineUser = async (req, res, next) => {
  const { userId, username } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ error: "Missing userId or username" });
  }

  const exists = await OfflineUser.findOne({ userId: userId });
  if (exists) {
    return res.status(409).json({ error: "User already exists" });
  }

  const offlineUser = new OfflineUser({
    userId,
    username,
  });
  try {
    await deleteOnlineUser(req.body.userId);

    await offlineUser.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  return res.status(201).json({ offlineUser });
};

export const deleteOfflineUser = async (userId) => {
  try {
    await OfflineUser.deleteOne({ userId: userId });
  } catch (err) {
    console.log(err);
  }
};
