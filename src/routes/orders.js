import express from "express";

import OrderController from "../app/controllers/OrderController.js";
import Auth from "../app/middlewares/Auth.js";
import Filter from "../app/middlewares/Filter.js";

const router = express.Router();

router.post("/status", OrderController.createOrderStatus);
router.post("/", Auth, OrderController.create);

router.get("/status", OrderController.getAllOrderStatus);
router.put("/:id", Auth, OrderController.updateStatus);
router.get("/:id", Auth, OrderController.get);
router.get("/", Auth, Filter, OrderController.getAll);

export default router;
