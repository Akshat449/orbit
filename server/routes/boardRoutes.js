import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import {createBoard, getBoards} from "../controllers/boardController.js";

const router = Router({ mergeParams: true });

router.post('/', protect, createBoard);
router.get('/', protect, getBoards);

export default router;