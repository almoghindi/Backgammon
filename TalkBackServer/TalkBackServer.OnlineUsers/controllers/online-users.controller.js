import { pushMessage, pushGameInvite } from "../app.js";
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

// export const getOnlineUser = async (req, res) => {
//   const { sender, reciever } = req.body;
//   console.log(req.body);
//   if (!reciever) {
//     return res.status(400).json({ error: "Missing username" });
//   }

//   try {
//     const onlineUser = getExistByUsername(reciever);
//     if (!onlineUser) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     console.log("in online user");
//     pushMessage(`${sender} sent you a message`, reciever);

//     return res.status(200).send();
//   } catch (err) {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const deleteOnlineUser = async (userId) => {
  try {
    await redisClient.hDel("online-users", userId);
    return true;
  } catch (error) {
    console.error("Error deleting online user from Redis:", error);
    return new Error("Error deleting online user");
  }
};

export const existByUsername = async (req, res) => {
  const { from, to } = req.body;
  try {
    if (!from || !to) {
      return res.status(400).json({ error: "Missing body" });
    }

    const exists = await isExistByUsername(to);
    if (!exists) {
      return res.status(404).json({ error: "User not found" });
    }

    pushMessage(`${from} sent you a message`, to);
    return res.status(200).json({ message: "User found" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const gameInvite = async (req, res) => {
  const { from, to } = req.body;
  try {
    if (!to || !from) {
      return res.status(400).json({ error: "Missing username" });
    }
    const exists = await isExistByUsername(to);
    if (!exists) {
      return res.status(404).json({ error: "User not found" });
    }

    pushGameInvite(from, to);
    return res.status(200).json({ message: "User found" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const isExistByUsername = async (username) => {
  const onlineUsers = await redisClient.hGetAll("online-users");
  if (!onlineUsers) {
    return false;
  }
  return Object.values(onlineUsers).includes(username);
};

// export const getOnlineUsers = async (req, res, next) => {
//   try {
//     const onlineUsers = await User.find({ isOnline: true });
//     res.status(200).send({ onlineUsers });
//   } catch (err) {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getOfflineUsers = async (req, res, next) => {
//   try {
//     const offlineUsers = await User.find({ isOnline: false });
//     res.status(200).send({ offlineUsers });
//   } catch (err) {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const addUserOrChangeUserStatus = async (req, res, next) => {
//   const { userId, username, status } = req.body;

//   if (!userId || !username) {
//     return res.status(400).json({ error: "Missing userId or username" });
//   }

//   try {
//     const existUser = await User.findOne({ userId });
//     if (!existUser) {
//       const user = new User({ userId, username, isOnline: true });
//       await user.save();
//       return res
//         .status(201)
//         .json({ message: "User added and logged in successfully" });
//     } else {
//       existUser.isOnline = status == "online" ? true : false;
//       console.log(existUser + " - hi");
//       await existUser.save();
//       return res
//         .status(200)
//         .json({ message: "User status updated successfully!" });
//     }
//   } catch (err) {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };
