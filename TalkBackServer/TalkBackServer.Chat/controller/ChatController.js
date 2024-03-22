import Chat from "../models/message.js";
import { emitEventToUser } from "../app.js";
import { addUserToSocketMap } from "../app.js";

export async function saveMessage(req, res, next) {
  const { messageData } = req;
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
    };
    chat.messages.push(message);
    await chat.save();
    return res.status(201).send({ message: "Message saved successfully" });
  } catch (err) {
    return next(err);
  }
}

export async function enterChat(req, res, next) {
  try {
    const { data, to } = req.body;
    addUserToSocketMap(data);
    emitEventToUser("user-joined", data.username, to);
    const chatId = (await getChat(data.username, to)).chatId;
    req.messageData = {
      sender: data.username,
      content: `${data.username} joined`,
      timestamp: new Date(),
      reciever: to,
      isAdmin: true,
    };
    req.chatId = chatId;
    return next();
  } catch (err) {
    console.error(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { message, to } = req.body;
    emitEventToUser("new-message", message, to);
    req.messageData = {
      ...message,
      reciever: to,
    };
    return next();
  } catch (err) {
    throw err;
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
