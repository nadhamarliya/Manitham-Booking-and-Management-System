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
      const response = await fetch(`${API_BASE_URL}/slots/${todayKey}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSlots(data.slots);
      }
    } catch (error) {
      console.error("Error loading daily appointment configurations:", error);
    }
  };

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
  
