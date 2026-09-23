import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { createWorkspace, getWorkspace } from "../controllers/workspaceController.js";
import boardRoutes from "./boardRoutes.js";

const router = Router();

router.post('/', protect, createWorkspace);
router.get('/', protect, getWorkspace);

router.use('/:workspaceId/boards', boardRoutes);

export default router;