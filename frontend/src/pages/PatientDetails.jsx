import React from 'react';
import Sidebar from '../components/dashboard/AdminSidebar';
import PatientSummary from '../components/patients/PatientSummary'; 

const PatientDetails = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-[260px] p-8">
        <PatientSummary />
      </div>
    </div>
  );
};

export default PatientDetails;
