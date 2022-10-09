import React from "react";
import { useEmployeeLogout } from "../../../hooks/useEmployeeLogout";

const Guard = () => {

    const { logout } = useEmployeeLogout();

    return (
        <div>
            Guard Dashboard
            <button onClick={() => logout()}>logout</button>
        </div>
    )
}

export default Guard;