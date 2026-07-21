import React from 'react';
import Sidebar from '../components/dashboard/AdminSidebar';
import SponsorSummary from '../components/sponsors/SponsorSummary'; 

const SponsorDetails = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[260px] p-4 lg:p-8 pt-20 lg:pt-8 w-full overflow-hidden">
        <SponsorSummary />
      </div>
    </div>
  );
};

export default SponsorDetails;
