import React from 'react';

const BookingCard = ({ slotNumber, slotName, status, booking, onManageClick }) => {
  
  // Custom status pill backgrounds matching your dashboard screenshots
  const getStatusStyles = (currentStatus) => {
    switch (currentStatus) {
      case 'Booked': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Empty':
      default: return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    /* 1. Added "group" class here so we can detect hover states inside the child element */
    <div className="group bg-white rounded-2xl border border-slate-100 flex overflow-hidden min-h-[180px] shadow-sm transition-all duration-200">
      
      {/* 2. The left accent bar: default slate-900, changes to indigo-500 on card hover */}
      <div className="w-[6px] bg-slate-900 group-hover:bg-indigo-500 shrink-0 transition-colors duration-200" />

      {/* Main card text frame area */}
      <div className="flex-1 px-6 py-5 flex flex-col justify-between">
        <div>
          {/* Permanent Title Label */}
          <h3 className="text-xl font-bold tracking-tight text-slate-800">
            Slot {slotNumber} - <span className="font-semibold text-slate-600">{slotName}</span>
          </h3>

          {/* Dynamic Status Pill Variant */}
          <div className="mt-2.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold border rounded-full ${getStatusStyles(status)}`}>
              Status: {status === 'Booked' ? 'Confirmed' : status}
            </span>
          </div>

          {/* Explicitly labeled text rows below status badge */}
          {status !== 'Empty' && booking && (
            <div className="mt-3 space-y-1 text-xs font-medium text-slate-500">
              {booking.name && (
                <p className="truncate">
                  <span className="text-slate-400">name:</span> {booking.name}
                </p>
              )}
              {booking.phone && (
                <p>
                  <span className="text-slate-400">ph:</span> {booking.phone}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Button layout panel */}
        <div className="mt-5 pt-3 border-t border-slate-50">
          <button 
            onClick={onManageClick}
            className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100/80 text-xs font-bold text-slate-600 rounded-xl border border-slate-200/60 cursor-pointer transition-colors"
          >
            Manage Allocation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
