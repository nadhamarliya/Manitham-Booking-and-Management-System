import User from "./models/User.js";
import bcrypt from "bcrypt";
import connectToDatabase from "./db/db.js";

const userRegister = async () => {
    connectToDatabase();
    try {
        const hashedPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin"
        });
        await newUser.save();
    } catch (error) {
        console.log(error);
    }  
}

userRegister();