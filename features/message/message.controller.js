import Message from "./message.model.js";
import User from "../auth/auth.model.js";

import path from "path";

const createMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const receiver = await User.findById(receiverId);

    if (!receiver)
      return res.status(404).json({ message: "Receiver not found!" });

    const imagePath = req.file ? path.join("uploads", req.file.filename) : null;

    const newMessage = new Message({
      content,
      receiverId,
      image: imagePath,
    });
    await newMessage.save();

    res
      .status(201)
      .json({ message: "Message sent successfully!", messageData: newMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ receiverId: req.user.id });

    if (!messages)
      return res.status(404).json({ message: "No messages found." });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message)
      return res.status(404).json({ message: "Message not found!" });

    if (message.receiverId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this message." });
    }

    await message.remove();
    res.status(200).json({ message: "Message deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createMessage, getMessages, deleteMessage };
