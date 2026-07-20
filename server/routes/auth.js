import express from "express";
import { 
    login, 
    verify, 
    forgotPassword, 
    resetPasswordFromLink, 
    registerStaff, 
    getStaffList, 
    updateStaff, // 🎯 Ensure updateStaff is explicitly written here
    deleteStaff 
} from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Primary Authentication Routes
router.post("/login", login);
router.get("/verify", authMiddleware, verify);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPasswordFromLink);

// Private Staff Registry Endpoints
router.post("/register-staff", authMiddleware, registerStaff);
router.get("/staff-list", authMiddleware, getStaffList);
router.put("/update-staff/:id", authMiddleware, updateStaff); // 🎯 Securely handles the update trigger
router.delete("/delete-staff/:id", authMiddleware, deleteStaff);

export default router;
