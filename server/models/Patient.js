import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    dateAdmission: { type: String, required: true },
    dateArrival: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    dob: { type: String, required: true },
    age: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inpatient", "Outpatient", "Discharged"], default: "Active" },
    nationality: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    guardianName: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    guardianMobile: { type: String, required: true, trim: true },
    altContact: { type: String, trim: true },
    residentCategory: { type: String, required: true },
    otherCategory: { type: String, trim: true },
    wakeUpTime: { type: String, default: "" },
    sleepingTime: { type: String, default: "" },
    height: { type: String, default: "" },
    weight: { type: String, default: "" },
    bmi: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model("Patient", patientSchema);
