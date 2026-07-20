import Sponsor from "../models/Sponsor.js";

// 1. Register a New Sponsor
export const addSponsor = async (req, res) => {
    try {
        const newSponsor = new Sponsor(req.body);
        await newSponsor.save();
        return res.status(201).json({ success: true, message: "Sponsor registered successfully inside MongoDB!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Fetch All Sponsors & Identify Pending Reminders
export const getSponsorsList = async (req, res) => {
    try {
        const sponsors = await Sponsor.find({});
        
        // Auto-Reminder Logic: Cross-check expiration flags dynamically on every fetch
        const updatedSponsors = sponsors.map(sponsor => {
            const data = sponsor.toObject();
            if (data.endDate && new Date(data.endDate) < new Date()) {
                data.reminderDue = true; // Flag tells frontend to highlight this row item
            } else {
                data.reminderDue = false;
            }
            return data;
        });

        return res.status(200).json({ success: true, sponsors: updatedSponsors });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Update an Existing Sponsor
export const updateSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSponsor = await Sponsor.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedSponsor) {
            return res.status(404).json({ success: false, error: "Sponsor profile not located." });
        }
        return res.status(200).json({ success: true, message: "Sponsor profile updated in MongoDB!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Delete a Sponsor permanently
export const deleteSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Sponsor.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: "Sponsor profile not located." });
        }
        return res.status(200).json({ success: true, message: "Sponsor removed from database successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
