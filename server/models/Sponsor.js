import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
    date: { type: String, required: true }, 
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    type: { 
        type: String, 
        required: true, 
        enum: ["Food", "Money", "Clothes", "Medical"] 
    },
    amount: { 
        type: Number, 
        required: function() { return this.type === 'Money'; },
        min: 0 
    },
    paymentType: { 
        type: String, 
        required: function() { return this.type === 'Money'; },
        enum: ["One-time", "Recurring"] 
    }
}, { timestamps: true });

// FIX: Prevents OverwriteModelError by checking if the model exists first
export default mongoose.models.Sponsor || mongoose.model("Sponsor", sponsorSchema);
