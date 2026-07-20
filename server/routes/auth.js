import express from "express";
import { 
    login, 
    verify, 
    registerStaff, 
    getStaffList, 
    updateStaff, 
    deleteStaff 
} from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Primary Authentication Routes
router.post("/login", login);
router.get("/verify", authMiddleware, verify);

// Private Staff Registry Endpoints (Admin changes passwords here!)
router.post("/register-staff", authMiddleware, registerStaff);
router.get("/staff-list", authMiddleware, getStaffList);
router.put("/update-staff/:id", authMiddleware, updateStaff); 
router.delete("/delete-staff/:id", authMiddleware, deleteStaff);

export default router;
