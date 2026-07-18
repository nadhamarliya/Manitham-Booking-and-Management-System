import React from 'react';
import Sidebar from '../components/dashboard/AdminSidebar';
import StaffSummary from '../components/staff/StaffSummary';

const StaffDetails = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-[260px] p-8">
        <StaffSummary />
      </div>
    </div>
  );
};

export default StaffDetails;
