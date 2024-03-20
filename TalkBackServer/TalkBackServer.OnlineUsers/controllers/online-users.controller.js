import redisClient from "../utils/redis.js";
import { deleteOfflineUser } from "./offline-users.controller.js";
export const getOnlineUsers = async (req, res, next) => {
  try {
    const onlineUsers = await redisClient.hGetAll("online-users");
    return res.status(200).json({ onlineUsers });
  } catch (error) {
    console.error("Error getting online users from Redis:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const addOnlineUser = async (req, res, next) => {
  const { userId, username } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ error: "Missing userId or username" });
  }

  try {
    const exists = await redisClient.hExists("online-users", userId);
    if (exists) {
      await redisClient.hDel("online-users", userId);
    }

    await deleteOfflineUser(userId);
    await redisClient.hSet("online-users", userId, username);
    return res.status(201).send("User added successfully!");
  } catch (error) {
    console.error("Error setting online user in Redis:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteOnlineUser = async (userId) => {
  try {
    await redisClient.hDel("online-users", userId);
    return true;
  } catch (error) {
    console.error("Error deleting online user from Redis:", error);
    return new Error("Error deleting online user");
  }
};
