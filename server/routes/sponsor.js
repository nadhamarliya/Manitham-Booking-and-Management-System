import express from "express";
import { addSponsor, getSponsorsList, updateSponsor, deleteSponsor } from "../controller/sponsorController.js";
import authMiddleware from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Put the protection layers back
router.post("/add", authMiddleware, addSponsor);
router.get("/list", authMiddleware, getSponsorsList);
router.put("/update/:id", authMiddleware, updateSponsor);
router.delete("/delete/:id", authMiddleware, deleteSponsor);

export default router;
