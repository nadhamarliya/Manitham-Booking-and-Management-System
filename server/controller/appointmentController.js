import Appointment from "../models/Appointment.js";
import Sponsor from "../models/Sponsor.js";

// Default clean slots fallback template layout
const DEFAULT_SLOTS = [
  { slotNumber: '1', slotName: 'Breakfast', status: 'Empty', booking: null },
  { slotNumber: '2', slotName: 'Lunch', status: 'Empty', booking: null },
  { slotNumber: '3', slotName: 'Dinner', status: 'Empty', booking: null },
];

// 1. Get or Initialize Daily Slots for a specific Date
export const getDailySlots = async (req, res) => {
    try {
        const { dateKey } = req.params;
        
        // Find existing slots for this day
        let slots = await Appointment.find({ dateKey });

        // If no slots exist in DB for today yet, create them automatically
        if (slots.length === 0) {
            const initialSlots = DEFAULT_SLOTS.map(slot => ({
                dateKey,
                ...slot
            }));
            slots = await Appointment.insertMany(initialSlots);
        }

        // Map database records into uniform frontend format with id keys
        const formattedSlots = slots.map(slot => ({
            id: slot._id,
            slotNumber: slot.slotNumber,
            slotName: slot.slotName,
            status: slot.status,
            booking: slot.booking
        }));

        return res.status(200).json({ success: true, slots: formattedSlots });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Save/Update an Appointment Slot and clone it under Food Sponsors
export const saveSlotBooking = async (req, res) => {
    try {
        const { dateKey, slotNumber, slotName, status, name, phone } = req.body;

        // 1. Update the slot in the appointments collection
        const updatedSlot = await Appointment.findOneAndUpdate(
            { dateKey, slotNumber },
            { 
                slotName,
                status, 
                booking: status === 'Empty' ? null : { name: name.trim(), phone: phone.trim() } 
            },
            { new: true, upsert: true }
        );

        // 2. Clone it as a persistent "Food" sponsor record if it's a new booking
                // 2. Clone it as a persistent "Food" sponsor record if it does not exist yet
        if (status !== 'Empty' && name && phone) {
            const existingSponsor = await Sponsor.findOne({
                date: dateKey,
                name: name.trim(),
                phone: phone.trim(),
                type: 'Food'
            });

            // Only create a new profile row if it's a completely unique booking
            if (!existingSponsor) {
                const newFoodSponsor = new Sponsor({
                    date: dateKey,
                    name: name.trim(),
                    phone: phone.trim(),
                    type: 'Food'
                });
                await newFoodSponsor.save();
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: "Slot saved and duplicated to Food sponsors successfully!" 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
