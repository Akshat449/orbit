import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, default: "" },
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    position: { type: Number, required: true, default: 0 }
}, { timestamps: true });

cardSchema.index({ list: 1, position: 1 });
cardSchema.index({ board: 1 });

export default mongoose.model('Card', cardSchema);