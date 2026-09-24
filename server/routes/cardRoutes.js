import { Router } from "express";
import { createCard, getCards, updateCard, deleteCard, reorderCards } from "../controllers/cardController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.post('/lists/:listId/cards', protect, createCard);

router.get('/boards/:boardId/cards', protect, getCards);

router.put('/cards/reorder', protect, reorderCards); 

router.put('/cards/:cardId', protect, updateCard);

router.delete('/cards/:cardId', protect, deleteCard);

export default router;
