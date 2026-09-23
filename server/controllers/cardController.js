import Card from "../models/Card.js";
import List from "../models/List.js";
import Board from "../models/Board.js";

const createCard = async (req, res) => {
    try {
        const { listId } = req.params;
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Card title is required" });
        }

        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }

        const board = await Board.findById(list.board).populate('workspace');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const isMember = board.workspace.members.some(memberId => memberId.equals(req.user._id));

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        const lastCard = await Card.findOne({ list: listId }).sort({ position: -1 });
        const position = lastCard ? lastCard.position + 1 : 0;

        const card = await Card.create({
            title: title.trim(),
            description: req.body.description || "",
            list: listId,
            board: list.board,
            position
        });

        return res.status(201).json({ card, message: "Card created successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getCards = async (req, res) => {
    try {
        const { boardId } = req.params;
        const board = await Board.findById(boardId).populate('workspace');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const isMember = board.workspace.members.some(memberId => memberId.equals(req.user._id));

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        const cards = await Card.find({ board: boardId }).sort({ position: 1 }).lean();

        return res.status(200).json({ cards });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Card title is required" });
        }
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        const board = await Board.findById(card.board).populate('workspace');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const isMember = board.workspace.members.some(memberId => memberId.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }


        if (title) {
            card.title = title.trim();
        }
        if (description !== undefined) {
            card.description = description;
        }
        await card.save();

        return res.status(200).json({ card, message: "Card updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        const board = await Board.findById(card.board).populate('workspace');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const isMember = board.workspace.members.some(memberId => memberId.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }
        const { list, position } = card;

        await Card.findByIdAndDelete(cardId);

        await Card.updateMany(
            { list, position: { $gt: position } },
            { $inc: { position: -1 } }
        );

        return res.status(200).json({ message: "Card deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    createCard,
    getCards,
    updateCard,
    deleteCard
};
