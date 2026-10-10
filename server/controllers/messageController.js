import Message from "../models/Message.js";
import Board from "../models/Board.js";

const getMessages = async (req, res) => {
    try {
        const { boardId } = req.params;
        const board = await Board.findById(boardId).populate('workspace');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        const isMember = board.workspace.members.some(m => m.equals(req.user._id));
        if (!isMember) {
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