import OfflineUser from "../models/OfflineUser.js";
import { deleteOnlineUser } from "./OnlineUsersController.js";
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
  console.log(req.body);
  const offlineUser = new OfflineUser({
    userId: req.body.userId,
    username: req.body.username,
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
