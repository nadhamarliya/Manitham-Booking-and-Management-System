import React from 'react';
import { X } from 'lucide-react';

const PatientDetailDrawer = ({ isOpen, onClose, patient, getStatusBadgeStyles }) => {
  if (!isOpen || !patient) return null;

  return (
    <>
      {/* Blur Backdrop Mask Overlay Layer */}
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Side View Slider Sheet Grid Workspace */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 text-left animate-in slide-in-from-right duration-200">
        
        {/* Header Module Title Panel */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{patient.name}</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Comprehensive Health & Registration Profile</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Read-Only Content Body View Area Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* BLOCK 1: PRIMARY TIMELINE METRICS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1.5">1. Admission Information</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date of Admission</p><p className="mt-0.5 font-semibold text-slate-700">{patient.dateAdmission || 'N/A'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date of Arrival</p><p className="mt-0.5 font-semibold text-slate-700">{patient.dateArrival || 'N/A'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date of Birth</p><p className="mt-0.5 font-semibold text-slate-700">{patient.dob || 'N/A'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Age / Gender</p><p className="mt-0.5 font-semibold text-slate-700">{patient.age} Yrs / {patient.gender}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Blood Group</p><p className="mt-0.5 font-semibold text-slate-700">{patient.bloodGroup || 'N/A'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Status</p><p className="mt-1"><span className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full ${getStatusBadgeStyles(patient.status)}`}>{patient.status}</span></p></div>
            </div>
          </div>

          {/* BLOCK 2: FAMILY EMERGENCY PROFILE METRICS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1.5">2. Contact & Address Details</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nationality</p><p className="mt-0.5 font-semibold text-slate-700">{patient.nationality || 'N/A'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Guardian Name</p><p className="mt-0.5 font-semibold text-slate-700">{patient.guardianName || 'N/A'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Relationship</p><p className="mt-0.5 font-semibold text-slate-700">{patient.relation || 'N/A'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Guardian Mobile</p><p className="mt-0.5 font-semibold text-slate-700 font-mono">{patient.guardianMobile || 'N/A'}</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Alternative Contact</p><p className="mt-0.5 font-semibold text-slate-700 font-mono">{patient.altContact || 'N/A'}</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Permanent Address Details</p><p className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 font-medium leading-relaxed break-words">{patient.address || 'N/A'}</p></div>
            </div>
          </div>

          {/* BLOCK 3: DIAGNOSTIC PROFILE PROFILE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1.5">3. Resident Medical Category</h3>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Primary Classification Profile</p>
              <p className="mt-1.5 text-sm font-bold text-slate-800 bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-2.5 w-fit">
                {patient.residentCategory === 'Others' ? patient.otherCategory : patient.residentCategory}
              </p>
            </div>
          </div>

          {/* BLOCK 4: ROUTINES & BIOMETRIC ESTIMATION DATA METRICS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1.5">4. Routines & Physical Metrics</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Wake-Up Time</p><p className="mt-0.5 font-semibold text-slate-700 font-mono">{patient.wakeUpTime || 'N/A'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sleeping Time</p><p className="mt-0.5 font-semibold text-slate-700 font-mono">{patient.sleepingTime || 'N/A'}</p></div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Height</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{patient.height || '-'}<span className="text-xs font-semibold text-slate-400 ml-0.5">cm</span></p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weight</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{patient.weight || '-'}<span className="text-xs font-semibold text-slate-400 ml-0.5">kg</span></p>
              </div>
              <div className="p-3 bg-indigo-900 text-white rounded-xl text-center shadow-xs">
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">BMI Score</p>
                <p className="text-lg font-black mt-0.5">{patient.bmi || 'N/A'}</p>
              </div>
            </div>
          </div>

        </div>

        {/* View More Footer Action Sheet Closing Control Panel */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-white rounded-xl shadow-sm cursor-pointer transition-all">
            Close Profile
          </button>
        </div>

      </div>
    </>
  );
};

export default PatientDetailDrawer;
