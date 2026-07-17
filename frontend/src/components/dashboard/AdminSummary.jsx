import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingCard from './BookingCard';
import AppointmentDrawer from './AppointmentDrawer'; // Ensure your drawer component is imported here

const AdminSummary = () => {
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  // 1. Shared main state array tracking updates for all 3 meals
  const [slots, setSlots] = useState([
    { id: '1', slotNumber: '1', slotName: 'Breakfast', status: 'Booked', booking: { name: 'nadha', phone: '9788772966' } },
    { id: '2', slotNumber: '2', slotName: 'Lunch', status: 'Empty', booking: null },
    { id: '3', slotNumber: '3', slotName: 'Dinner', status: 'Empty', booking: null },
  ]);

  // 2. Actionable hook trackers for controlling drawer viewport layouts
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleOpenDrawer = (slot) => {
    setSelectedSlot(slot);
    setIsDrawerOpen(true);
  };

  const handleSaveBooking = (slotId, updatedData) => {
    setSlots(slots.map(slot => 
      slot.id === slotId 
        ? { 
            ...slot, 
            status: updatedData.status, 
            booking: { name: updatedData.name, phone: updatedData.phone } 
          } 
        : slot
    ));
    setIsDrawerOpen(false);
  };

  return (
    <div className="p-2 relative">
      {/* Header Layout */}
      <div className="flex items-center gap-2.5 mb-6 text-slate-900">
        <Calendar size={22} className="stroke-[2.5]" /> 
        <h2 className="text-xl font-black tracking-wider uppercase">Appointments - {today}</h2>
      </div>

      {/* 3. Grid container loop wired with the missing action listener props */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {slots.map((slot) => (
          <BookingCard 
            key={slot.id} 
            {...slot} 
            onManageClick={() => handleOpenDrawer(slot)} 
          />
        ))}
      </div>

      {/* 4. Global Sliding Sidebar Form Panel Overlay Module */}
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
