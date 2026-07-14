import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";

// Fixed: Added missing imports (Adjust the file paths if your folders are structured differently)
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SponsorDetails from "./pages/SponsorDeatails";
import PatientDetails from "./pages/PatientDetails";
import LoginForm from "./components/LoginForm";


const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
  <Route path="/" element={<Navigate to="/login" replace />} />
  
  <Route path="/login" element={<Login />} />

  <Route element={<Layout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/sponsordetails" element={<SponsorDetails />} />
    <Route path="/patientdetails" element={<PatientDetails />} />
  </Route>

  <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes>
   
    </> 
  );
};

export default App;
