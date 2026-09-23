import List from "../models/List.js";
import Board from "../models/Board.js";
import Card from "../models/Card.js"

const createList = async (req, res) => {
    try {
        const { boardId } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }
        const board = await Board.findById(boardId).populate("workspace");
        if (!board) {
            return res.status(404).json({ message: "Board not found" })
        }

        const isMember = board.workspace.members.some(memberId => memberId.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this board" })
        }

        const lastList = await List.findOne({ board: boardId }).sort({ position: -1 });
        const position = lastList ? lastList.position + 1 : 0;

        const list = await List.create({ title: title.trim(), board: boardId, position });
        return res.status(201).json({ message: "List created successfully", list });

    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error" })
    }
}

const getLists = async (req, res) => {
    try {
        const { boardId } = req.params;
        const board = await Board.findById(boardId).populate("workspace");
        if (!board) {
            return res.status(404).json({ message: "Board not found" })
        }

        const isMember = board.workspace.members.some(memberId => memberId.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this board" })
        }
        const lists = await List.find({ board: boardId }).sort({ position: 1 }).lean();
        return res.status(200).json({ message: "Lists fetched successfully", lists });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error" })
    }
}

const updateList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { title } = req.body;

        if (!title || !listId) {
            return res.status(400).json({ message: "Title and listId are required" });
        }
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ message: "List not found" })
        }
        const board = await Board.findById(list.board).populate("workspace");
        if (!board) {
            return res.status(404).json({ message: "Board not found" })
        }
        const isMember = board.workspace.members.some(memberId => memberId.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this board" })
        }
        list.title = title.trim();
        await list.save();
        return res.status(200).json({ message: "List updated successfully", list });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error" })
    }
}

const deleteList = async (req, res) => {
    try {
        const { listId } = req.params;
        if (!listId) {
            return res.status(400).json({ message: "ListId is required" })
        }
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ message: "List not found" })
        }
        const { position } = list;
        const board = await Board.findById(list.board).populate("workspace");
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const isMember = board.workspace.members.some(memberId => memberId.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this board" });
        }

        await List.findByIdAndDelete(listId);
        await Card.deleteMany({ list: listId });
        await List.updateMany(
            { board: list.board, position: { $gt: position } },
            { $inc: { position: -1 } }
        );

        return res.status(200).json({ message: "List deleted successfully" });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error" })
    }
}

export { createList, getLists, updateList, deleteList };