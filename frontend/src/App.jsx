import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SponsorDetails from "./pages/SponsorDetails"; 
import PatientDetails from "./pages/PatientDetails"; 
import StaffDetails from "./pages/StaffDetails";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

const App = () => {                         
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard"/>} />
        <Route path="/login" element={<Login/>} />

        <Route path="/login" element={<Login/>} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route path="/dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin', 'user']}>
              <Dashboard/>
            </RoleBaseRoutes>
          </PrivateRoutes>
        }/>

        <Route path="/sponsor-details" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin', 'user']}>
              <SponsorDetails />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }/>

        <Route path="/patient-details" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin', 'user']}>
              <PatientDetails />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }/>

        <Route path="/staff-details" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin']}>
              <StaffDetails />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
