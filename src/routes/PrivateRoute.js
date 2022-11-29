import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"

function RequireAuth({ children }) {
    let location = useLocation();
    let user = {};
    if (localStorage.getItem('user'))
        user = JSON.parse(localStorage.getItem('user'));

    if (!localStorage.getItem('user') || user.type) {
        return <Navigate to="/client/login" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;