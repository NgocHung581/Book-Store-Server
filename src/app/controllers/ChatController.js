import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

class ChatController {
    // [GET] /chats
    async getAll(req, res, next) {
        try {
            const chats = await Chat.find({})
                .populate("user", "fullName avatar")
                .populate("latestMessage");
            res.status(200).json({ data: chats });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // [GET] /chats
    async createChat(req, res, next) {
        const { userId } = req.user;

        await Chat.create({ _id: userId, user: userId });
        res.status(201).json({
            message: "Bạn vừa tạo thành công cuộc trò chuyện với admin",
        });
    }

    // [GET] /chats/:id
    async getChatOfUser(req, res, next) {
        const { id } = req.params;

        try {
            const chat = await Chat.findOne({ _id: id });

            if (chat) {
                const messages = await Message.find({
                    chat: chat?._id,
                }).populate("sender", "fullName avatar");
                res.status(200).json({ data: messages });
            } else {
                res.status(200).json({ data: chat });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // [POST] /chats/:id
    async sendMessage(req, res, next) {
        const { userId } = req.user;
        const { id } = req.params;
        const { message } = req.body;

        try {
            const newMessage = await Message.create({
                sender: userId,
                content: message,
                chat: id,
            });
            await Chat.findOneAndUpdate(
                { _id: id },
                { latestMessage: newMessage._id },
                { returnDocument: "after" }
            );

            res.status(200).json({ data: newMessage });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ChatController();
