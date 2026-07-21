import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/authContext.jsx'; 
import { 
  User, 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  ShieldAlert, 
  ChevronRight,
  LogOut,
  Menu, 
  X 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth(); 
  const userName = user?.name || "John Doe";
  const userRole = user?.role || "user"; 
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  // Freezes background scrolling on phones when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, roles: ['admin', 'user'] },
    { to: "/sponsor-details", label: "Sponsor Details", icon: <Users size={18} />, roles: ['admin', 'user'] },
    { to: "/patient-details", label: "Patient Details", icon: <UserCheck size={18} />, roles: ['admin', 'user'] },
    { to: "/staff-details", label: "Staff Details", icon: <ShieldAlert size={18} />, roles: ['admin'] }
  ];

  return (
    <>
      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-4 z-40 text-white">
        <h2 className="font-bold text-[18px] tracking-wide">Manitham Portal</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE BACKGROUND MASK OVERLAY */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* RESTORED: Master Container reverts back to your original structural heights */}
      <div className={`bg-slate-900 text-white h-[100dvh] fixed top-0 bottom-0 left-0 w-[260px] border-r border-white/5 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* UPPER CONTENT CONTAINER */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
          
          {/* RESTORED: Your original beautiful desktop branding stays intact */}
          <div className="px-5 pt-6 pb-2 hidden lg:flex items-center gap-3">
            <h2 className="font-bold text-[20px] tracking-wide leading-tight">Manitham Portal</h2>
          </div>

          {/* 
            FIXED MOBLIE TEXT: 
            - Visible ONLY on phones/tablets (lg:hidden)
            - Replaces the blank gap with your portal title text to fill the area beautifully!
          */}
          <div className="px-5 pt-6 pb-2 block lg:hidden">
            <h2 className="font-bold text-[20px] tracking-wide leading-tight text-white/90">
              Manitham Portal
            </h2>
          </div>

          {/* RESTORED: Reverted your user block layout settings exactly back to normal */}
          <div className="px-4 mb-4 mt-4">
            <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold text-slate-300 uppercase shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-[13px] font-semibold text-slate-200 leading-tight truncate w-36">
                  {userName}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 capitalize">{userRole}</p>
              </div>
            </div>
          </div>

          <div className="px-5 mb-2">
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Navigation</p>
          </div>

          <div className="px-3 space-y-1 flex-1">
            {menuItems.map((item) => {
              if (!item.roles.includes(userRole)) return null;
              return (
                <NavLink 
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)} 
                  className={({ isActive }) => 
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-indigo-600/10 text-indigo-400 border-l-[3px] border-indigo-500 pl-[13px]" 
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight size={14} className="text-indigo-400" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* LOGOUT BUTTON (Stays locked to bottom layout lines) */}
        <div className="p-4 border-t border-white/5 bg-slate-900 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
