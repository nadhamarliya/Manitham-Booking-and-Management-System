import React from 'react';
import Sidebar from '../components/dashboard/AdminSidebar';
import StaffSummary from '../components/staff/StaffSummary';

const StaffDetails = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[260px] p-4 lg:p-8 pt-20 lg:pt-8 w-full overflow-hidden">
        <StaffSummary />
      </div>
    </div>
  );
};

export default StaffDetails;
