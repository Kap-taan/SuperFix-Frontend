import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"

function PublicAuth({ children }) {
    let location = useLocation();

    const user = localStorage.getItem('user');

    if (user) {
        const type = JSON.parse(user).type;
        if (type) {
            return <Navigate to="/employee/dashboard" state={{ from: location }} replace />;
        }
        return <Navigate to="/client/dashboard" state={{ from: location }} replace />;
    }

    if (!localStorage.getItem('user')) {
        return children;
    }


}

export default PublicAuth;