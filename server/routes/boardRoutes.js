import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import {createBoard, getBoards} from "../controllers/boardController.js";

const router = Router();

router.post('/',protect,createBoard);
router.get('/:workspaceId',protect,getBoards);

export default router;