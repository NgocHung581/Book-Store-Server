import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Message = new Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    },
    { timestamps: true, collection: "messages" }
);

export default mongoose.model("Message", Message);
