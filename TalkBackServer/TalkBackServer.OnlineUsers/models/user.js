import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("user", userSchema);
