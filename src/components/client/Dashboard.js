import React from "react";
import { useEmployeeLogout } from "../../hooks/useEmployeeLogout";

const Client = () => {

    const { logout } = useEmployeeLogout();

    return (
        <div style={{ color: '#fff' }}>
            Client Dashboard
            <button onClick={() => {
                logout()
            }}>logout</button>
        </div>
    )
}

export default Client;