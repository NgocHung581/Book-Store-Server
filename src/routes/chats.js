import express from "express";

import ChatController from "../app/controllers/ChatController.js";
import Auth from "../app/middlewares/Auth.js";

const router = express.Router();

router.get("/:id", Auth, ChatController.getChatOfUser);
router.post("/:id", Auth, ChatController.sendMessage);
router.post("/", Auth, ChatController.createChat);
router.get("/", Auth, ChatController.getAll);

export default router;
