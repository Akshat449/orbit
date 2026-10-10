import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: { type: String, required: [true, "Message content is required"], trim: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
}, { timestamps: true });

messageSchema.index({ board: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
