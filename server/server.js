import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

