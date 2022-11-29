import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Mechanic from "./Mechanic/Dashboard";
import Accountant from "./Accountant/Dashboard";
import Guard from "./Guard/Guard";
import Manager from "./Manager/Dashboard";
import classes from './Dashboard.module.css';
import AdminDashboard from "../Admin/Dashboard/AdminDashboard";
import Spareparts from "./Spareparts/Dashboard";

const EmployeeDashboard = () => {

    const { user } = useAuthContext();
    const [role, setRole] = useState('loading');

    useEffect(() => {
        if (user) {
            setRole(user.type);
            console.log(user.type);
        }

    }, [user])

    return (
        <>
            {role === 'loading' && <div>Loading...</div>}
            {role === 'mechanic' && <Mechanic />}
            {role === 'accountant' && <Accountant />}
            {role === 'guard' && <Guard />}
            {role === 'manager' && <Manager />}
            {role === 'admin' && <AdminDashboard />}
            {role === 'storemanager' && <Spareparts />}
            {!role && <div className={classes.error}>
                <h2>Unauthorized Access</h2>
                <a href="/client/dashboard"><button>Go Back to your Dashboard</button></a>
            </div>}
        </>
    );
}

export default EmployeeDashboard;