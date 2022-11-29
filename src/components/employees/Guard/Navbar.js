import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useEmployeeLogout } from "../../../hooks/useEmployeeLogout";
import { Link } from "react-router-dom";
import classes from './Navbar.module.css';


const NavbarG = () => {

    const { logout } = useEmployeeLogout();

    const { user } = useAuthContext();

    // States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            console.log(user);
            setName(user.employeeId);
            setEmail(user.email);

        }
    }, [user])

    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_one}>
                <div className={classes.navbar_one__one}>
                    <div className={classes.navbar_one__one_one}>
                        <img src="/media/logo2.svg" alt="Icon" />
                        <h4>Super <span style={{ color: '#20c9ff' }}>Fix</span></h4>
                    </div>
                    <div className={classes.navbar_one__one_two}>
                        <h3>Take Charge of your time</h3>
                    </div>
                </div>
            </div>
            <div className={classes.navbar_two}>
                <nav className={classes.navbar_two_one}>
                    <Link to="/employee/dashboard">
                        <div className={classes.navbar_two__one_one}>
                            <img src="/icon/home.svg" alt="Home" />
                            <h4>Home</h4>
                        </div>
                    </Link>
                    <div className={classes.navbar_two__one_one}>
                        <img src="/icon/setting1.svg" alt="Setting" />
                        <h4>Setting</h4>
                    </div>
                    <div className={classes.navbar_two__one_one}>
                        <img src="/icon/help1.svg" alt="Help" />
                        <h4>Help</h4>
                    </div>
                </nav>
            </div>
            <div className={classes.navbar_three}>
                <div className={classes.navbar_three_one}>
                    <div className={classes.navbar_three_one_one}>
                        <img src="/icon/user1.svg" alt="User" />
                    </div>
                    <div className={classes.navbar_three_one_two}>
                        <h4>{name}</h4>
                        <h5>{email}</h5>
                    </div>
                </div>
                <div className={classes.navbar_three_two}>
                    <h4 onClick={() => {
                        logout()
                    }}>Logout</h4>
                </div>
            </div>
        </div >
    );
}

export default NavbarG;