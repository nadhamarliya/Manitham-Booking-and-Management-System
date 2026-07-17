import React from 'react';
import Sidebar from '../components/dashboard/AdminSidebar';
import SponsorSummary from '../components/sponsors/SponsorSummary'; 

const SponsorDetails = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-[260px] p-8">
        <SponsorSummary />
      </div>
    </div>
  );
};

export default SponsorDetails;
