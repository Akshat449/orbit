import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { createWorkspace, getWorkspace } from "../controllers/workspaceController.js";
import { createBoard, getBoards } from "../controllers/boardController.js";

const router = Router();

router.post('/', protect, createWorkspace);
router.get('/', protect, getWorkspace);

router.get('/:workspaceId/boards', protect, getBoards);
router.post('/:workspaceId/boards', protect, createBoard);

export default router;