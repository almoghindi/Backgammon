import Chat from "../models/Message.js";
import { emitEventToUser } from "../app.js";

export async function saveMessage(req, res, next) {
  const { messageData } = req;
  try {
    console.log(messageData);
    const chat = await getChat(messageData.sender, messageData.receiver);
    const message = {
      sender: messageData.sender,
      reciever: messageData.receiver,
      timestamp: messageData.timestamp,
      content: messageData.content,
    };
    chat.messages.push(message);
    await chat.save();
    return res.status(201).send({ message: "Message saved successfully" });
  } catch (err) {
    return next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { message, to } = req.body;
    emitEventToUser("new-message", message, to);
    req.messageData = {
      ...message,
      receiver: to,
    };
    return next();
  } catch (err) {
    throw err;
  }
}

export async function getChatBySenderReciever(req, res, next) {
  const { sender, reciever } = req.body;
  const chat = await getChat(sender, reciever);
  res.status(200).send(JSON.stringify(chat));
}

export async function getChat(sender, receiver) {
  try {
    const id = `${sender}&${receiver}`;
    const revId = `${receiver}&${sender}`;
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
