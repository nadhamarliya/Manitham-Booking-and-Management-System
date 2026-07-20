import Patient from "../models/Patient.js";

export const addPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        return res.status(201).json({ success: true, message: "Patient registered successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getPatientsList = async (req, res) => {
    try {
        const patients = await Patient.find({});
        return res.status(200).json({ success: true, patients });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ success: false, error: "Patient not found." });
        }
        return res.status(200).json({ success: true, message: "Patient updated successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Patient.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: "Patient not found." });
        }
        return res.status(200).json({ success: true, message: "Patient deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
