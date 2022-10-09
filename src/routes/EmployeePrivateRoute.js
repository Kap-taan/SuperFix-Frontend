import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"

function RequireAuthE({ children }) {
    let location = useLocation();
    if (!localStorage.getItem('user')) {
        return <Navigate to="/employee/login" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuthE;