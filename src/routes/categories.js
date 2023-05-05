import express from "express";

import CategoryController from "../app/controllers/CategoryController.js";
import Filter from "../app/middlewares/Filter.js";
import Auth from "../app/middlewares/Auth.js";
import AdminRole from "../app/middlewares/AdminRole.js";

const router = express.Router();

router.delete("/:id", Auth, AdminRole, CategoryController.delete);
router.put("/:id", Auth, AdminRole, CategoryController.update);
router.post("/", Auth, AdminRole, CategoryController.create);
router.get("/:slug", CategoryController.get);
router.get("/", Filter, CategoryController.getAll);

export default router;
