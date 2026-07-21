import React, { useState, useEffect } from 'react';
import { Calendar, Bell } from 'lucide-react';
import BookingCard from './BookingCard';
import AppointmentDrawer from './AppointmentDrawer';

const API_BASE_URL = "https://manitham-portal.onrender.com/api/sponsor"; 

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

const AdminSummary = () => {
  const todayDateString = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayKey = new Date().toISOString().split('T')[0];

  const [slots, setSlots] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [reminders, setReminders] = useState([]);
  
  const [dismissedSponsors, setDismissedSponsors] = useState(() => {
    const savedDismissed = localStorage.getItem('manitham_dismissed_sponsors');
    return savedDismissed ? JSON.parse(savedDismissed) : [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch today's slot configuration directly from DB
  const fetchDailySlots = async () => {
  try {
    const token = localStorage.getItem('manitham_token'); // Retrieve token

    const response = await fetch(`${API_BASE_URL}/slots/${todayKey}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Pass token
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.success) {
      setSlots(data.slots);
    }
  } catch (error) {
    console.error("Error loading daily appointment configurations:", error);
  }
};

// Apply this exact headers dictionary pattern to your fetchSponsors function as well!


  // Fetch global sponsors list to calculate reminder alerts
  const fetchSponsors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, { 
        method: 'GET',
        credentials: 'include' 
      });
      const data = await response.json();
      if (data.success) {
        setSponsors(data.sponsors);
      }
    } catch (error) {
      console.error("Error fetching live sponsors for alert logs:", error);
    }
  };

  useEffect(() => {
    fetchDailySlots();
    fetchSponsors();
  }, [todayKey]);

  useEffect(() => {
    const alerts = getSponsorReminders(sponsors);
    const activeAlerts = alerts.filter(alert => !dismissedSponsors.includes(alert._id));
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

  const handleSaveBooking = async (slotId, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          dateKey: todayKey,
          slotNumber: selectedSlot.slotNumber,
          slotName: selectedSlot.slotName,
          status: updatedData.status,
          name: updatedData.name,
          phone: updatedData.phone
        })
      });

      if (response.ok) {
        fetchDailySlots(); // Refresh slots directly from DB
        fetchSponsors();   // Refresh reminders log metrics
      }
    } catch (error) {
      console.error("Error saving slot selection:", error);
    }
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
                      <tr key={sponsor._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="checkbox" 
                            onChange={() => handleActionCheck(sponsor._id)}
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