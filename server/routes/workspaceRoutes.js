import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import {
    createWorkspace,
    getWorkspace,
    addWorkspaceMember,
    getWorkspaceMembers
} from "../controllers/workspaceController.js";
import boardRoutes from "./boardRoutes.js";

const router = Router();

router.post('/', protect, createWorkspace);
router.get('/', protect, getWorkspace);

router.post('/:workspaceId/members', protect, addWorkspaceMember);
router.get('/:workspaceId/members', protect, getWorkspaceMembers);

router.use('/:workspaceId/boards', boardRoutes);

export default router;