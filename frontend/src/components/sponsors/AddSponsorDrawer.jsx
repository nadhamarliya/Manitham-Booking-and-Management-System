import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddSponsorDrawer = ({ isOpen, onClose, onSave, onDelete, editingSponsor }) => {
  if (!isOpen) return null;

  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('');
  // New conditional states
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');

  useEffect(() => {
    if (editingSponsor) {
      setDate(editingSponsor.date || '');
      setName(editingSponsor.name || '');
      setPhone(editingSponsor.phone || '');
      setType(editingSponsor.type || '');
      setAmount(editingSponsor.amount || '');
      setPaymentType(editingSponsor.paymentType || '');
    } else {
      setDate('');
      setName('');
      setPhone('');
      setType('');
      setAmount('');
      setPaymentType('');
    }
  }, [editingSponsor, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { 
      date, 
      name, 
      phone, 
      type: type || 'Food' 
    };

    // Attach conditional parameters only if money type is selected
    if (type === 'Money') {
      payload.amount = Number(amount);
      payload.paymentType = paymentType || 'One-time';
    }

    onSave(payload);
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50" onClick={onClose} />

      <form onSubmit={handleSubmit} className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{editingSponsor ? 'Update Sponsor Profile' : 'Add New Sponsor'}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 rounded-xl"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registration Date</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sponsor Name</label>
            <input type="text" required placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
            <input type="tel" required placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sponsor Type</label>
            <select required value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
              <option value="">Select option</option>
              <option value="Food">Food</option>
              <option value="Money">Money</option>
              <option value="Clothes">Clothes</option>
              <option value="Medical">Medical</option>
            </select>
          </div>

          {/* DYNAMIC CONDITIONAL FIELDS */}
          {type === 'Money' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount (₹)</label>
                <input type="number" required min="0" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Frequency</label>
                <select required value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
                  <option value="">Select frequency</option>
                  <option value="One-time">One-time</option>
                  <option value="Recurring">Recurring</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 mt-auto">
          <div>
            {editingSponsor ? (
              <button type="button" onClick={() => onDelete(editingSponsor._id)} className="px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer">Delete</button>
            ) : (
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer">Close</button>
            )}
          </div>
          <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer">{editingSponsor ? 'Save Changes' : 'Add Sponsor'}</button>
        </div>
      </form>
    </>
  );
};

export default AddSponsorDrawer;
