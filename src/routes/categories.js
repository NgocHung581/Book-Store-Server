import express from "express";
import CategoryController from "../app/controllers/CategoryController.js";

const router = express.Router();

router.delete("/:id", CategoryController.delete);
router.put("/:id", CategoryController.update);
router.post("/", CategoryController.create);
router.get("/", CategoryController.getAll);

export default router;
