import express from "express";
import { addSponsor, getSponsorsList, updateSponsor, deleteSponsor } from "../controller/sponsorController.js";
import { getDailySlots, saveSlotBooking } from "../controller/appointmentController.js"; // New handlers
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Sponsor Management Endpoints
router.post("/add", authMiddleware, addSponsor);
router.get("/list", authMiddleware, getSponsorsList);
router.put("/update/:id", authMiddleware, updateSponsor);
router.delete("/delete/:id", authMiddleware, deleteSponsor);

// Appointment Slot Endpoints
router.get("/slots/:dateKey", authMiddleware, getDailySlots);
router.post("/slots/book", authMiddleware, saveSlotBooking);

export default router;
