import Sponsor from "../models/Sponsor.js";

// 1. Register a New Sponsor (Handles both regular manual additions and calendar slot allocations)
export const addSponsor = async (req, res) => {
    try {
        const { date, name, phone, type, amount, paymentType, slotId } = req.body;

        // If the request comes from the Appointment Slots drawer, it contains a slotId
        if (slotId && name && phone) {
            const newAppointmentSponsor = new Sponsor({
                date: date || new Date().toISOString().split('T')[0], // Use incoming date or default to today
                name: name.trim(),
                phone: phone.trim(),
                type: 'Food' // Automatically set type to Food for appointment bookings
            });

            await newAppointmentSponsor.save();
            return res.status(201).json({ 
                success: true, 
                message: "Slot allocation successfully saved as a Food sponsor in MongoDB!" 
            });
        }

        // Standard path: Handles submissions directly from the AddSponsorDrawer component form
        const newSponsor = new Sponsor({
            date,
            name,
            phone,
            type: type || 'Food',
            amount,
            paymentType
        });

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
