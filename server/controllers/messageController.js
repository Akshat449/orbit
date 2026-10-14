import Message from "../models/Message.js";
import Board from "../models/Board.js";

const getMessages = async (req, res) => {
    try {
        const { boardId } = req.params;
        const board = await Board.findById(boardId).populate('workspace');
        if (!board || !board.workspace) {
            return res.status(404).json({ message: "Board or workspace not found" });
        }
        const userId = req.user._id.toString();
        const isMember = board.workspace.members?.some(m => m.toString() === userId);
        const isOwner = board.workspace.owner?.toString() === userId;
        if (!isMember && !isOwner) {
            return res.status(403).json({ message: "Not authorized to access this board" });
        }
        const messages = await Message.find({ board: boardId })
            .sort({ createdAt: 1 })
            .populate("sender", "name email")
            .lean();
        res.status(200).json({ messages });
    }
    catch (error) {
        console.log("Error getting messages:", error);
        res.status(500).json({ success: false, message: "Error getting messages" });
    }
}

export { getMessages };