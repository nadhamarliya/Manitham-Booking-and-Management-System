import React from 'react';
import { NavLink , useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/authContext.jsx'; // Correct up-two-folders relative lookup path
import { 
  User, 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  ShieldAlert, 
  ChevronRight,
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth(); // Destructured active context hooks
  const userName = user?.name || "John Doe";
  const userRole = user?.role || "user"; 

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Triggers session cleanup inside context state array keys
    console.log("Logging out user...");
    navigate('/login');
  };

  return (
    <div className="bg-slate-900 text-white h-screen fixed left-0 top-0 bottom-0 w-[260px] border-r border-white/5 flex flex-col justify-between">
      
      <div>
        <div className="px-5 pt-6 pb-6 flex items-center gap-3">
          <div>
            <h2 className="font-bold text-[20px] text-white tracking-wide leading-tight">Manitham Portal</h2>
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold text-slate-300 uppercase">
              {userName.charAt(0)}
            </div>
            <div>
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

        <div className="px-3 space-y-1">
          
          <NavLink 
            to="/dashboard"
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
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-indigo-400" />}
              </>
            )}
          </NavLink>

          <NavLink 
            to="/sponsor-details"
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
                  <Users size={18} />
                  <span>Sponsor Details</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-indigo-400" />}
              </>
            )}
          </NavLink>

          <NavLink 
            to="/patient-details"
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
                  <UserCheck size={18} />
                  <span>Patient Details</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-indigo-400" />}
              </>
            )}
          </NavLink>

          {/* CRITICAL ROLE GUARD: Only mounts link tab if active credentials match 'admin' */}
          {userRole === 'admin' && (
            <NavLink 
              to="/staff-details"
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
                    <ShieldAlert size={18} />
                    <span>Staff Details</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-indigo-400" />}
                </>
              )}
            </NavLink>
          )}

        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
