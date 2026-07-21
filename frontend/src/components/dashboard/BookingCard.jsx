import React from 'react';

const BookingCard = ({ slotNumber, slotName, status, booking, onManageClick }) => {
  
  const getStatusStyles = (currentStatus) => {
    switch (currentStatus) {
      case 'Booked': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Empty':
      default: return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 flex overflow-hidden min-h-[160px] sm:min-h-[180px] shadow-sm transition-all duration-200 w-full">
      
      {/* Accent left boundary track marker line */}
      <div className="w-[6px] bg-slate-900 group-hover:bg-indigo-500 shrink-0 transition-colors duration-200" />

      {/* 
        FIXED: 
        - Swapped hardcoded px-6 py-5 for fluid fluid padding variables (p-4 sm:p-5 lg:px-6 lg:py-5) to maximize screen economy on smartphones.
      */}
      <div className="flex-1 p-4 sm:p-5 lg:px-6 lg:py-5 flex flex-col justify-between overflow-hidden">
        <div>
          {/* FIXED: Dynamic heading scaling (text-lg on mobile, text-xl on desktop) prevents string breaks */}
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 truncate">
            Slot {slotNumber} - <span className="font-semibold text-slate-600">{slotName}</span>
          </h3>

          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold border rounded-full ${getStatusStyles(status)}`}>
              Status: {status === 'Booked' ? 'Confirmed' : status}
            </span>
          </div>

          {status !== 'Empty' && booking && (
            <div className="mt-3 space-y-1 text-xs font-medium text-slate-500 overflow-hidden">
              {booking.name && (
                <p className="truncate">
                  <span className="text-slate-400">name:</span> {booking.name}
                </p>
              )}
              {booking.phone && (
                <p className="truncate">
                  <span className="text-slate-400">ph:</span> {booking.phone}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-50">
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
