import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Mechanic from "./Mechanic/Dashboard";
import Accountant from "./Accountant/Accountant";
import Guard from "./Guard/Guard";
import Manager from "./Manager/Manager";

const EmployeeDashboard = () => {

    const { user } = useAuthContext();
    const [role, setRole] = useState('loading');

    useEffect(() => {
        if (user)
            setRole(user.type);
    }, [user])

    return (
        <>
            {role === 'loading' && <div>Loading...</div>}
            {role === 'mechanic' && <Mechanic />}
            {role === 'accountant' && <Accountant />}
            {role === 'guard' && <Guard />}
            {role === 'manager' && <Manager />}
        </>
    );
}

export default EmployeeDashboard;