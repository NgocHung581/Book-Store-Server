import express from "express";

import UploadFile from "../app/middlewares/UploadFile.js";
import BookController from "../app/controllers/BookController.js";
import Filter from "../app/middlewares/Filter.js";

const router = express.Router();

router.get("/category/:slug", Filter, BookController.getSpecificCategory);
router.get("/feature", BookController.getFeature);
router.get("/search", Filter, BookController.search);

router.get("/:slug/reviews", Filter, BookController.getReviews);

router.get("/:slug", BookController.get);
router.put("/:id", BookController.update);
router.delete("/:id", BookController.delete);

router.post("/", UploadFile.single("image"), BookController.create);
router.get("/", Filter, BookController.getAll);

export default router;
