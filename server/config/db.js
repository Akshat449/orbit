import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;