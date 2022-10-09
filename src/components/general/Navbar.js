import React from "react";
import { Link } from "react-router-dom";
import classes from './Navbar.module.css'

const Navbar = () => {
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar__one}>
                <div className={classes.navbar__one_one}>
                    <img src="/media/logo2.svg" alt="Logo" />
                    <h4>Super <span style={{ color: '#20c9ff' }}>Fix</span></h4>
                </div>
            </div>
            <div className={classes.navbar__one_two}>
                <ul>
                    <li>About</li>
                    <li>Team</li>
                    <li>Features</li>
                    <li>Contact</li>
                </ul>
            </div>
            <div className={classes.navbar__two}>
                <Link to="/employee/login"><button>Employee Login</button></Link>
                <Link to="/client/login"><button className={classes.get_started}>Sign In</button></Link>
            </div>
        </div>
    )
}

export default Navbar;