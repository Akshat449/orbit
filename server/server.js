import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import protect from "./middleware/authMiddleware.js";
import listRoutes from "./routes/listRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth",authRoutes)

app.use("/api/workspaces",workspaceRoutes)

app.use("/api/boards/:boardId/lists", listRoutes);

app.use("/api", cardRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

