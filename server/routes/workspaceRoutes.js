import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import {createWorkspace, getWorkspace} from "../controllers/workspaceController.js";

const router = Router();

router.post('/',protect,createWorkspace);
router.get('/',protect,getWorkspace);

export default router;