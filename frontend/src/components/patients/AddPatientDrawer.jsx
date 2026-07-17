import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddPatientDrawer = ({ isOpen, onClose, onSave, onDelete, patient }) => {
  if (!isOpen) return null;

  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (patient) {
      setDate(patient.date || '');
      setName(patient.name || '');
      setAge(patient.age || '');
      setGender(patient.gender || '');
      setPhone(patient.phone || '');
      setStatus(patient.status || '');
    } else {
      setDate('');
      setName('');
      setAge('');
      setGender('');
      setPhone('');
      setStatus('');
    }
  }, [patient, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      date, 
      name, 
      age, 
      gender, 
      phone, 
      status: status || 'Active' 
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Side Drawer */}
      <form onSubmit={handleSubmit} className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{patient ? 'Update Patient Profile' : 'Add New Patient'}</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Manage information registry controls</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Registration Date */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registration Date</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Name</label>
            <input type="text" required placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>

          {/* Age & Gender*/}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
              <input type="number" required placeholder="Age" min="0" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
              <select required value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
            <input type="tel" required placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admission Status</label>
            <select required value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
              <option value="">Select option</option>
              <option value="Active">Active</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 mt-auto">
          <div>
            {patient ? (
              <button type="button" onClick={() => onDelete(patient.id)} className="px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors">Delete</button>
            ) : (
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer transition-colors">Close</button>
            )}
          </div>
          <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer transition-colors">
            {patient ? 'Save Changes' : 'Add Patient'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddPatientDrawer;
