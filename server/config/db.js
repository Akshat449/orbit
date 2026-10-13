import mongoose from "mongoose";

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/orbit";
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("MongoDB Atlas connection failed:", error.message);

        // Fallback to local MongoDB if available
        if (MONGO_URI !== "mongodb://127.0.0.1:27017/orbit") {
            try {
                console.log("Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/orbit)...");
                await mongoose.connect("mongodb://127.0.0.1:27017/orbit");
                console.log("Connected to local MongoDB (orbit)");
                return;
            } catch (localError) {
                console.error("Local MongoDB fallback also failed:", localError.message);
            }
        }

        console.error("\n=======================================================");
        console.error("⚠️ MONGODB CONNECTION FAILED");
        console.error("If using MongoDB Atlas, make sure your IP is whitelisted:");
        console.error("1. Go to cloud.mongodb.com -> Network Access");
        console.error("2. Add your current IP or allow access from anywhere (0.0.0.0/0)");
        console.error("=======================================================\n");
        process.exit(1);
    }
};

export default connectDB;