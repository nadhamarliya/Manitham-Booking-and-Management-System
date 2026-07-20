import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://admin:ADMIN123ADMIN@cluster0.72rqpkn.mongodb.net/ManithamDB?appName=Cluster0");
        console.log("Database connected successfully");

        // 🎯 DEVELOPMENT CORRECTION UTILITY: Forcefully drop old ghost indexing structures
        try {
            await mongoose.connection.db.collection('users').dropIndexes();
            console.log("Successfully wiped old collection ghost indexes!");
        } catch (indexErr) {
            console.log("No old indexes to clear, skipping safely.");
        }

    } catch (error) {
        console.log("Database connection error:", error);
    }
}

export default connectToDatabase;
