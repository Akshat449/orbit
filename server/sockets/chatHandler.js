import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Board from "../models/Board.js";

function registerChatHandlers(io) {
    //connection-level authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication required"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.id}`);
        // event listeners
        socket.on("join-board", async (boardId) => {
            try {
                const board = await Board.findById(boardId).populate("workspace");
                if (!board || !board.workspace) return;

                const userId = (socket.user.id || socket.user._id)?.toString();
                const isMember = board.workspace.members?.some(m => m.toString() === userId);
                const isOwner = board.workspace.owner?.toString() === userId;

                if (isMember || isOwner) {
                    socket.join(boardId);
                    console.log(`Socket ${socket.id} joined room ${boardId}`);
                }
            } catch (err) {
                console.error("Error joining room:", err);
            }
        });

        socket.on("leave-board", (boardId) => {
            socket.leave(boardId);
            console.log(`Socket ${socket.id} left room ${boardId}`);
        });

        socket.on("send-message", async ({ boardId, content }) => {
            if (!boardId || !content || !content.trim()) return;

            try {
                const message = await Message.create({
                    content: content.trim(),
                    board: boardId,
                    sender: socket.user.id || socket.user._id
                });

                const populatedMessage = await message.populate("sender", "name email");
                io.to(boardId).emit("new-message", populatedMessage);
            } catch (err) {
                console.error("Failed to save and broadcast message:", err);
            }
        });
    });
}

export default registerChatHandlers;