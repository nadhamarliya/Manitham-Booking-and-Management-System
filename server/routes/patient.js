import express from "express";
import { addPatient, getPatientsList, updatePatient, deletePatient } from "../controller/patientController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addPatient);
router.get("/list", authMiddleware, getPatientsList);
router.put("/update/:id", authMiddleware, updatePatient);
router.delete("/delete/:id", authMiddleware, deletePatient);

export default router;
