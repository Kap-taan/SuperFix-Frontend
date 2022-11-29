import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"

function AdminAuth({ children }) {
    let location = useLocation();
    const user = localStorage.getItem('user');
    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (user) {
        const type = JSON.parse(user).type;
        if (!type) {
            return <Navigate to="/client/dashboard" state={{ from: location }} replace />;
        }
        else {
            if (type !== 'admin') {
                return <Navigate to="/employee/dashboard" state={{ from: location }} replace />;
            }
            else {
                return children;
            }
        }
    }
}

export default AdminAuth;