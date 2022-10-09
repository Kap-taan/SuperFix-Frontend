import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddEmployee from "./components/Admin/AddEmployee/AddEmployee";
import General from "./components/general/General";
import LoginEmployee from "./components/employees/auth/Login";
import EmployeeDashboard from "./components/employees/Dashboard";
import RequireAuth from "./routes/PrivateRoute";
import RequireAuthE from "./routes/EmployeePrivateRoute";
import Client from "./components/client/Dashboard";
import LoginClient from "./components/client/auth/Login";
import SignupClient from "./components/client/auth/Signup";
import AdminDashboard from "./components/Admin/Dashboard/AdminDashboard";
import Slot from "./components/slot/Dashboard";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {

  const { user } = useAuthContext();

  console.log(user);



  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<General />} />
          <Route path="/client/signup" element={<SignupClient />} />
          <Route path="/client/login" element={<LoginClient />} />
          <Route path="/client/dashboard" element={<RequireAuth><Client /></RequireAuth>} />

          <Route path="/admin/addemployee" element={<AddEmployee />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/employee/login" element={<LoginEmployee />} />
          <Route path="/employee/dashboard" element={<RequireAuthE><EmployeeDashboard /></RequireAuthE>} />

          <Route path="/slot" element={<RequireAuth><Slot /></RequireAuth>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
