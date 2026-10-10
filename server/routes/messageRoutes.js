import express from "express";
import { getMessages } from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getMessages);

export default router;
