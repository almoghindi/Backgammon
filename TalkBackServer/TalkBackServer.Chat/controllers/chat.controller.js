import Chat from "../models/message.js";
import { emitEventToUser } from "../app.js";
import { addUserToSocketMap } from "../app.js";
import axios from "axios";

export async function saveMessage(req, res, next) {
  const { messageData } = req;
  console.log(messageData);
  try {
    let chat;
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
    return res;
  } catch (err) {
    return next(err);
  }
}

export async function enterChat(req, res, next) {
  console.log("in enter chattttt");
  const { data, to } = req.body;
  if (!data || !to) return res.status(400).send("no data sent");
  console.log("data ");
  addUserToSocketMap(data);
  emitEventToUser("user-joined", data.username, to);
  const chatId = (await getChat(data.username, to)).chatId;
  res.status(200).send();
}

export async function sendMessage(req, res, next) {
  const { message, to } = req.body;
  try {
    console.log("in send message");
    const pushNotificationResponse = await axios.post(
      "http://localhost:3004/api/users/sendMessage",
      { sender: message.sender, reciever: to }
    );
    console.log("pushNotificationResponse");
    if (pushNotificationResponse.status !== 200)
      throw new Error("user not connected");
    emitEventToUser("new-message", message, to);
    const timeOfDelivery = new Date();
    req.messageData = {
      ...message,
      timestamp: timeOfDelivery,
      reciever: to,
      isSent: true,
    };

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      timestamp: timeOfDelivery,
    });
    await next();
  } catch (err) {
    req.messageData = {
      ...message,
      reciever: to,
      isSent: false,
      isError: true,
    };
    console.log(req.messageData);
    res
      .status(500)
      .json({ success: false, message: "Message couldn't be sent" });
    return next();
  }
}

export async function leaveChat(req, res, next) {
  try {
    const { sender, to } = req.body;
    const message = {
      sender,
      content: `${sender} disconnected`,
      isAdmin: true,
      timestamp: new Date(),
    };
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
    const id = `${sender}&${reciever}`;
    const revId = `${reciever}&${sender}`;
    let chat = await Chat.findOne({ chatId: id });
    if (!chat) {
      chat = await Chat.findOne({ chatId: revId });
    }
    if (!chat) {
      chat = new Chat({ chatId: id, messages: [] });
    }
    return chat;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getChatById(chatId) {
  try {
    let chat = await Chat.findOne({ chatId: chatId });
    if (!chat) {
      chat = new Chat({
        chatId,
        messages: [],
      });
    }
    return chat;
  } catch (err) {
    throw err;
  }
}
