import express from "express";

import CartController from "../app/controllers/CartController.js";
import Auth from "../app/middlewares/Auth.js";

const router = express.Router();

router.delete("/", Auth, CartController.delete);
router.put("/", Auth, CartController.update);
router.post("/", Auth, CartController.add);
router.get("/", Auth, CartController.getAll);

export default router;
