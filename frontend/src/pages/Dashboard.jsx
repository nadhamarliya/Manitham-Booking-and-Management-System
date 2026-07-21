import React from 'react'
import { useAuth } from '../context/authContext.jsx';
import AdminSidebar from '../components/dashboard/AdminSidebar.jsx';
import AdminSummary from '../components/dashboard/AdminSummary.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className='flex min-h-screen bg-slate-50'>
      <AdminSidebar />
      
      <div className='flex-1 ml-0 lg:ml-[260px] p-4 lg:p-8 pt-20 lg:pt-8 w-full overflow-hidden'>
        <AdminSummary />
      </div>
    </div>
  )
}

export default Dashboard
