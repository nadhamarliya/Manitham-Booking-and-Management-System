import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

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

// 2. Token Generator & Outbound Personal Email Dispatcher
const forgotPassword = async (req, res) => {
    let user = null;
    try {
        const { email } = req.body;
        user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(200).json({ success: true, message: "A secure reset link has been dispatched to your inbox if the account exists." });
        }

        const rawResetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(rawResetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${rawResetToken}`;

        const emailHtml = `
            <div style="font-family: sans-serif; max-width: 500px; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #0d9488; margin-top: 0; font-size: 20px;">Manitham Portal Password Reset</h2>
                <p style="color: #334155; font-size: 14px;">Hello ${user.name},</p>
                <p style="color: #334155; font-size: 14px;">You requested a password reset for your staff login account. Click the button below to update your credentials:</p>
                <div style="margin: 24px 0;">
                    <a href="${resetUrl}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; font-size: 14px;">Reset Password</a>
                </div>
                <p style="font-size: 12px; color: #64748b; background-color: #f8fafc; padding: 10px; border-radius: 6px;">
                    This link is valid for 15 minutes. If you did not make this request, you can safely ignore this email.
                </p>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: "Manitham Portal - Secure Password Reset Link",
            html: emailHtml
        });

        return res.status(200).json({ success: true, message: "A secure reset link has been dispatched to your inbox if the account exists." });
    } catch (error) {
        console.error("Mailing Error context:", error.message);
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
        }
        return res.status(500).json({ success: false, error: "Email dispatch failed. Verify server configurations." });
    }
};

// 3. Process & Verify Password Overwrite from Email Link
const resetPasswordFromLink = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: "Your reset token link is invalid or has expired." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated successfully! You can now log in." });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const verify = async (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
};

// 4. Securely Register a New Staff Member into MongoDB Atlas
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

// 5. Fetch All Registered Staff Members from MongoDB (Excluding Passwords)
const getStaffList = async (req, res) => {
    try {
        const staffMembers = await User.find({}).select("-password");
        return res.status(200).json({ success: true, staff: staffMembers });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch staff directory from database." });
    }
};

// 6. Securely Update Staff Profile Metrics & Password Credentials from Admin Portal
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

// 7. Delete a Staff Member from MongoDB Atlas
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Staff account removed successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to delete staff member from database." });
    }
};

// Clean Named Export Mapping Bindings
export { 
    login, 
    verify, 
    forgotPassword, 
    resetPasswordFromLink, 
    registerStaff, 
    getStaffList, 
    updateStaff, 
    deleteStaff 
};
