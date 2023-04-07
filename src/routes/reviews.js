import express from "express";

import ReviewController from "../app/controllers/ReviewController.js";
import Auth from "../app/middlewares/Auth.js";

const router = express.Router();

router.post("/", Auth, ReviewController.create);
router.get("/:bookId", ReviewController.getAll);

export default router;
