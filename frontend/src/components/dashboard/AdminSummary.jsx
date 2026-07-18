import React, { useState, useEffect } from 'react';
import { Calendar, Bell } from 'lucide-react';
import BookingCard from './BookingCard';
import AppointmentDrawer from './AppointmentDrawer';

// Engine logic to check for anniversaries exactly 10 days away
const getSponsorReminders = (sponsorsList) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return sponsorsList.filter(sponsor => {
    if (!sponsor.date) return false;
    
    const regDate = new Date(sponsor.date);
    const currentYear = today.getFullYear();
    
    const anniversaryThisYear = new Date(currentYear, regDate.getMonth(), regDate.getDate());
    const timeDiff = anniversaryThisYear.getTime() - today.getTime();
    const daysUntilAnniversary = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return daysUntilAnniversary === 10;
  });
};

// Default empty layout state template for a brand new day
const DEFAULT_SLOTS = [
  { id: '1', slotNumber: '1', slotName: 'Breakfast', status: 'Empty', booking: null },
  { id: '2', slotNumber: '2', slotName: 'Lunch', status: 'Empty', booking: null },
  { id: '3', slotNumber: '3', slotName: 'Dinner', status: 'Empty', booking: null },
];

const AdminSummary = () => {
  const todayDateString = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  
  // Clean date key identifier to mark today uniquely (e.g., "2026-07-18")
  const todayKey = new Date().toISOString().split('T')[0];

  // 1. Slots state initialized with automatic old-day checking mechanics
  const [slots, setSlots] = useState(() => {
    const savedSlotsData = localStorage.getItem('manitham_daily_slots');
    const savedSlotsDate = localStorage.getItem('manitham_slots_date_key');

    // If a saved timestamp exists and matches today's date, restore the values
    if (savedSlotsData && savedSlotsDate === todayKey) {
      return JSON.parse(savedSlotsData);
    }
    
    // Otherwise, it's a brand new day! Wipe the old data and return clear slots
    return DEFAULT_SLOTS;
  });

  const [sponsors, setSponsors] = useState([]);
  const [reminders, setReminders] = useState([]);
  
  const [dismissedSponsors, setDismissedSponsors] = useState(() => {
    const savedDismissed = localStorage.getItem('manitham_dismissed_sponsors');
    return savedDismissed ? JSON.parse(savedDismissed) : [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // 2. Automatically sync active slot choices and today's date to storage on every state shift
  useEffect(() => {
    localStorage.setItem('manitham_daily_slots', JSON.stringify(slots));
    localStorage.setItem('manitham_slots_date_key', todayKey);
  }, [slots, todayKey]);

  useEffect(() => {
    const savedSponsors = localStorage.getItem('manitham_sponsors');
    if (savedSponsors) {
      setSponsors(JSON.parse(savedSponsors));
    }
  }, []);

  useEffect(() => {
    const alerts = getSponsorReminders(sponsors);
    const activeAlerts = alerts.filter(alert => !dismissedSponsors.includes(alert.id));
    setReminders(activeAlerts);
  }, [sponsors, dismissedSponsors]);

  const handleActionCheck = (sponsorId) => {
    setTimeout(() => {
      setDismissedSponsors((prev) => {
        const updatedDismissed = [...prev, sponsorId];
        localStorage.setItem('manitham_dismissed_sponsors', JSON.stringify(updatedDismissed));
        return updatedDismissed;
      });
    }, 200);
  };

  const handleOpenDrawer = (slot) => {
    setSelectedSlot(slot);
    setIsDrawerOpen(true);
  };

  const handleSaveBooking = (slotId, updatedData) => {
    setSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === slotId 
          ? { 
              ...slot, 
              status: updatedData.status, 
              booking: updatedData.status === 'Empty' ? null : { name: updatedData.name, phone: updatedData.phone } 
            } 
          : slot
      )
    );
    setIsDrawerOpen(false);
  };

  return (
    <div className="p-2 relative space-y-8">
      
      {/* Header Layout */}
      <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-4 text-slate-900">
        <Calendar size={22} className="stroke-[2.5]" /> 
        <h2 className="text-xl font-black tracking-wider uppercase">Appointments - {todayDateString}</h2>
      </div>

      {/* Grid Container for Appointment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {slots.map((slot) => (
          <BookingCard 
            key={slot.id} 
            {...slot} 
            onManageClick={() => handleOpenDrawer(slot)} 
          />
        ))}
      </div>

      {/* Sponsorship Renewal Alerts Table Section */}
      {reminders.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            <Bell size={20} className="stroke-[2.5]" />
            <h3 className="text-base font-black tracking-wider uppercase">Sponsorship Renewal Alerts (10 Days Left)</h3>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-xs font-bold text-slate-200 uppercase tracking-wider">
                    <th className="px-6 py-4 w-20 text-center">Called</th>
                    <th className="px-6 py-4 w-16 text-center">S.No</th>
                    <th className="px-6 py-4">Sponsor Name</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">Sponsor Type</th>
                    <th className="px-6 py-4 text-center">Renewal Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm font-normal text-slate-600 bg-white">
                  {reminders.map((sponsor, index) => {
                    const dateObj = new Date(sponsor.date);
                    const renewalDayStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
                    
                    return (
                      <tr key={sponsor.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="checkbox" 
                            onChange={() => handleActionCheck(sponsor.id)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
                          />
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-center font-normal">{index + 1}</td>
                        <td className="px-6 py-4 text-slate-700 font-normal">{sponsor.name}</td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap font-normal">{sponsor.phone}</td>
                        <td className="px-6 py-4 text-slate-600 font-normal">{sponsor.type || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-slate-700 font-normal">
                          {renewalDayStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Global Sliding Sidebar Form Panel Overlay Module */}
      {selectedSlot && (
        <AppointmentDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          slot={selectedSlot}
          onSave={handleSaveBooking}
        />
      )}
    </div>
  );
};

export default AdminSummary;
