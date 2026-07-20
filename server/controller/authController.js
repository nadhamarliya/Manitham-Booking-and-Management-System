import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// 1. Secure Login with HTTP-Only Cookie
const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const loginIdentifier = email || username;

        if (!loginIdentifier) {
            return res.status(400).json({ success: false, error: "Email or username is required" });
        }

        const user = await User.findOne({ email: loginIdentifier.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ success: false, error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: "10d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 10 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ 
            success: true, 
            user: { _id: user._id, name: user.name, role: user.role } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Token-Free Validation verification hook check
const verify = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: "Unauthorized access profile credentials" });
        }
        return res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


// 5. Staff Registration Handler
const registerStaff = async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;
        const staffEmail = email || username;

        if (!staffEmail) {
            return res.status(400).json({ success: false, error: "Email address is required." });
        }

        const userExists = await User.findOne({ email: staffEmail.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({ success: false, error: "A staff account with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaff = new User({
            name: name.trim(),
            email: staffEmail.toLowerCase().trim(),
            password: hashedPassword,
            role: role || "user"
        });

        await newStaff.save();
        return res.status(201).json({ success: true, message: "Staff account created successfully!" });
    } catch (error) {
        console.error("Staff Registration Error Log:", error.message);
        return res.status(500).json({ success: false, error: "Internal server error during staff registration." });
    }
};

// 6. Fetch All Registered Staff Members from MongoDB (Excluding Passwords)
const getStaffList = async (req, res) => {
    try {
        const staffMembers = await User.find({}).select("-password");
        return res.status(200).json({ success: true, staff: staffMembers });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch staff directory from database." });
    }
};

// 7. Securely Update Staff Profile Metrics & Password Credentials from Admin Portal
const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, error: "Staff member profile not found." });
        }

        if (email && email.toLowerCase().trim() !== user.email) {
            const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
            if (emailExists) {
                return res.status(400).json({ success: false, error: "This email address is already in use by another account." });
            }
            user.email = email.toLowerCase().trim();
        }

        if (name) user.name = name.trim();
        if (role) user.role = role;

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        return res.status(200).json({ success: true, message: "Staff account profile updated successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal server error during staff profile update configuration." });
    }
};

// 8. Delete a Staff Member from MongoDB Atlas
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Staff account removed successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to delete staff member from database." });
    }
};

// 9. Unified Clean Named Export Block (Zero Duplications)
export { 
    login, 
    verify,       
    registerStaff, 
    getStaffList, 
    updateStaff, 
    deleteStaff 
};
