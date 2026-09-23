import express from "express";
import { createList, getLists, updateList, deleteList } from "../controllers/listController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post('/', protect, createList);
router.get('/', protect, getLists);
// router.put('/reorder',reorderLists);
router.put('/:listId', protect, updateList);
router.delete('/:listId', protect, deleteList);

export default router;