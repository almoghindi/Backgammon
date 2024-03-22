import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const Chat = new Schema({
  chatId: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender: {
        type: String,
        required: true,
      },
      reciever: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
      isAdmin: {
        type: Boolean,
      },
    },
  ],
});

export default mongoose.model("chat", Chat);
