const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chatId: {
    type: String,
    required: true,
  },
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
  timeStamp: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("message", messageSchema);
