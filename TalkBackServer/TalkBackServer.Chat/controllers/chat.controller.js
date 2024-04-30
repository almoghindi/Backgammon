import Chat from "../models/Message.js";
import { emitEventToUser } from "../app.js";
import { addUserToSocketMap } from "../app.js";
import redisClient from "../cache/redisClient.js";
import axios from "axios";

let isCaching = false;

export async function saveMessage(req, res, next) {
  const { messageData } = req;
  try {
    let chat;
    isCaching = false;
    if (!req.chatId) {
      chat = await getChat(messageData.sender, messageData.reciever);
    } else {
      chat = await getChatById(req.chatId);
    }
    const message = {
      sender: messageData.sender,
      reciever: messageData.reciever,
      timestamp: messageData.timestamp,
      content: messageData.content,
      isAdmin: messageData.isAdmin,
      isSent: messageData.isSent,
      isError: messageData.isError,
      messageId: messageData.messageId,
    };
    chat.messages.push(message);
    await chat.save();
    await redisClient.hSet("chat", chat.chatId, JSON.stringify(chat));
    return res;
  } catch (err) {
    return next(err);
  }
}

export async function enterChat(req, res, next) {
  try {
    const { data, to } = req.body;
    if (!data || !to) return res.status(400).send("no data sent");
    addUserToSocketMap(data);
    emitEventToUser("user-joined", data.username, to);
    const chatId = (await getChat(data.username, to)).chatId;
    res.status(200).send();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
}

export async function sendMessage(req, res, next) {
  const { message, to } = req.body;
  try {
    const pushNotificationResponse = await axios.post(
      `http://online_users-service:3004/api/users/online/exist-online-user`,
      {
        from: message.sender,
        to,
      }
    );
    if (pushNotificationResponse.status !== 200) {
      throw new Error("user not connected");
    }
    emitEventToUser("new-message", message, to);
    const timeOfDelivery = new Date();
    req.messageData = {
      ...message,
      timestamp: timeOfDelivery,
      reciever: to,
      isSent: true,
    };
    next();

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      timestamp: timeOfDelivery,
    });
  } catch (err) {
    req.messageData = {
      ...message,
      reciever: to,
      isSent: false,
      isError: true,
    };
    return res
      .status(500)
      .json({ success: false, message: "Message couldn't be sent" });
  }
}

export async function leaveChat(req, res, next) {
  try {
    const { sender, to } = req.body;
    const chatId = (await getChat(sender, to)).chatId;
    req.messageData = {
      ...message,
      reciever: to,
    };
    req.chatId = chatId;
    emitEventToUser("user-disconnected", message, to);
    return next();
  } catch (err) {
    console.error(err);
  }
}

export async function getChatBySenderReciever(req, res, next) {
  const { sender, reciever } = req.body;
  const chat = await getChat(sender, reciever);
  res.status(200).send(JSON.stringify(chat));
}

export async function getChat(sender, reciever) {
  try {
    const chatId = getChatId(sender, reciever);
    return getChatById(chatId);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const getChatId = (sender, reciever) => {
  return [sender, reciever].sort().join("&");
};

export async function getChatById(chatId) {
  try {
    if (isCaching) {
      const cachedChat = await redisClient.hGet("chat", chatId);
      if (cachedChat) {
        return JSON.parse(cachedChat);
      }
    }
    let chat = await Chat.findOne({ chatId: chatId });
    if (!chat) {
      chat = new Chat({
        chatId,
        messages: [],
      });
    }
    isCaching = true;
    return chat;
  } catch (err) {
    throw err;
  }
}
