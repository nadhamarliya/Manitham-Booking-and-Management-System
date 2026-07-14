import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"> 
      <p className="p-4 font-bold border-r border-slate-200 min-w-[200px]">Sidebar</p>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
