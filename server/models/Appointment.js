import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    dateKey: { type: String, required: true }, // Stores date as "2026-07-20"
    slotNumber: { type: String, required: true }, // "1", "2", or "3"
    slotName: { type: String, required: true }, // "Breakfast", "Lunch", "Dinner"
    status: { type: String, enum: ["Empty", "Pending", "Booked"], default: "Empty" },
    booking: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true }
    }
}, { timestamps: true });

// Prevents the exact same slot from being double-booked on the same day
appointmentSchema.index({ dateKey: 1, slotNumber: 1 }, { unique: true });

export default mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
