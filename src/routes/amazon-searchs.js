import express from "express";
import AmazonSearchController from "../app/controllers/AmazonSearchController.js";

const router = express.Router();

router.post("/onScraperComplete", AmazonSearchController.onScraperComplete);
router.post("/search", AmazonSearchController.search);
router.get("/search/results/:id", AmazonSearchController.getResults);

export default router;
