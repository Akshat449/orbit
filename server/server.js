import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import protect from "./middleware/authMiddleware.js";
import listRoutes from "./routes/listRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import registerChatHandlers from "./sockets/chatHandler.js";

dotenv.config();
connectDB();
const app = express();
const httpServer = http.createServer(app);

// Allow both production frontend and local development
const clientUrls = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""));

const allowedOrigins = [...new Set([...clientUrls, "http://localhost:5173"])];

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST"]
    },
    transports: ["websocket", "polling"]
});

registerChatHandlers(io);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth",authRoutes)

app.use("/api/workspaces",workspaceRoutes)

app.use("/api/boards/:boardId/lists", listRoutes);

app.use("/api", cardRoutes);

app.use("/api/boards/:boardId/messages", messageRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

