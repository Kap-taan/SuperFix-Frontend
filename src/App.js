import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddEmployee from "./components/Admin/AddEmployee/AddEmployee";
import General from "./components/general/General";
import LoginEmployee from "./components/employees/auth/Login";
import EmployeeDashboard from "./components/employees/Dashboard";
import RequireAuth from "./routes/PrivateRoute";
import RequireAuthE from "./routes/EmployeePrivateRoute";
import Client from "./components/client/Dashboard/Dashboard";
import LoginClient from "./components/client/auth/Login";
import SignupClient from "./components/client/auth/Signup";
import Slot from "./components/slot/Dashboard";
import { useAuthContext } from "./hooks/useAuthContext";
import NotFound from "./components/general/404";
import PublicAuth from "./routes/PublicRoute";
import AdminAuth from "./routes/AdminRoute";
import Services from "./components/client/services/Service";
import CarDetail from "./components/client/CarDetails/Dashboard";
import SingleService from "./components/client/services/SingleService";
import MechanicServices from "./components/employees/Mechanic/Services";
import Employees from "./components/Admin/Employees/Employees";
import Status from "./components/Admin/Status/Status";
import Cancel from "./components/Admin/Cancel/Cancel";
import Emergency from "./components/employees/Manager/Emergency";
import Offline from "./components/employees/Manager/Offline";
import Online from "./components/employees/Manager/Online";
import LiveStream from "./components/Livestream/LiveStream";
import Home from "./components/Livestream/Home";
import OperationalUnits from "./components/Admin/OperationalUnits/OperationalUnits";

function App() {

  const { user } = useAuthContext();


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicAuth><General /></PublicAuth>} />
          <Route path="/client/signup" element={<PublicAuth><SignupClient /></PublicAuth>} />
          <Route path="/client/login" element={<PublicAuth><LoginClient /></PublicAuth>} />
          <Route path="/client/dashboard" element={<RequireAuth><Client /></RequireAuth>} />
          <Route path="/client/services" element={<RequireAuth><Services /></RequireAuth>} />
          <Route path="/client/service/:collName/:serviceId" element={<RequireAuth><SingleService /></RequireAuth>} />
          <Route path="/client/cardetails" element={<RequireAuth><CarDetail /></RequireAuth>} />

          <Route path="/admin/addemployee" element={<AdminAuth><AddEmployee /></AdminAuth>} />
          <Route path="/admin/employees" element={<AdminAuth><Employees /></AdminAuth>} />
          <Route path="/admin/status" element={<AdminAuth><Status /></AdminAuth>} />
          <Route path="/admin/cancel" element={<AdminAuth><Cancel /></AdminAuth>} />
          <Route path="/admin/operationalunits" element={<AdminAuth><OperationalUnits /></AdminAuth>} />

          <Route path="/employee/login" element={<PublicAuth><LoginEmployee /></PublicAuth>} />
          <Route path="/employee/dashboard" element={<RequireAuthE><EmployeeDashboard /></RequireAuthE>} />

          {/* Service Manager */}
          <Route path="/employee/manager/offline" element={<RequireAuthE><Offline /></RequireAuthE>} />
          <Route path="/employee/manager/online" element={<RequireAuthE><Online /></RequireAuthE>} />
          <Route path="/employee/manager/emergencyslot" element={<RequireAuthE><Emergency /></RequireAuthE>} />

          {/* Mechanic */}
          <Route path="/employee/mechanic/services/:id" element={<MechanicServices />} />

          {/* Livestream */}
          <Route path="/client/livestream/:idd" element={<LiveStream type="client" />} />
          {/* <Route path="/employee/livestream" element={<Home type="mechanic" />} /> */}

          <Route path="/slot" element={<RequireAuth><Slot /></RequireAuth>} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
