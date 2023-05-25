import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Chat = new Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    { timestamps: true, collection: "chats", _id: false }
);

export default mongoose.model("Chat", Chat);
