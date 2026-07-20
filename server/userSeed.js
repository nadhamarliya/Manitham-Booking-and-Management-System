import User from "./models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userRegister = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        
        // Use environment variables instead of hardcoded strings
        const adminEmail = process.env.SEED_ADMIN_EMAIL || "nadhamarli@gmail.com";
        const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin";
        const adminName = process.env.SEED_ADMIN_NAME || "Admin";

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin account is already seeded inside MongoDB Atlas!");
            process.exit(0);
        }

        // Securely hash the password read from your hidden .env file
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newUser = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });
        
        await newUser.save();
        console.log("Admin account seeded successfully into MongoDB Atlas!");
        process.exit(0); 
    } catch (error) {
        console.log("Seeding Error:", error);
        process.exit(1);
    }  
}

userRegister();
