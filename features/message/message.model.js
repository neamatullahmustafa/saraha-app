import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: { type: String },
});

const Message = model("Message", messageSchema);

export default Message;
