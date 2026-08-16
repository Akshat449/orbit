import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import protect from "./middleware/authMiddleware.js";

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth",authRoutes)

app.get("/api/test", protect, (req, res) => {
    res.status(200).json({
        message: "Success! You made it past the bouncer.",
        vipUser: req.user 
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

