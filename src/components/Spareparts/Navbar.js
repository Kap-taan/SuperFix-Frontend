import React from "react";
import classes from './Navbar.module.css';
import back from '../img/b10.svg';


const Navbar = () => {
    return (
        <div className={classes.navbar} style={{ backgroundImage: `url(${back})` }}>
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
                    <div className={classes.navbar_two__one_one}>
                        <img src="/icon/homee.svg" alt="Home" />
                        <h4>Home</h4>
                    </div>
                    <div className={classes.navbar_two__one_one}>
                        <img src="/icon/car.svg" alt="Details" />
                        <h4>Car Details</h4>
                    </div>
                    <div className={classes.navbar_two__one_one}>
                        <img src="/icon/service.svg" alt="Service" />
                        <h4>Service Details</h4>
                    </div>
                    <div className={classes.navbar_two__one_one}>
                        <img src="/icon/slot.svg" alt="Slot" />
                        <h4>Slot</h4>
                    </div>
                    <div className={classes.navbar_two__one_one}>
                        <img src="/icon/setting.svg" alt="Setting" />
                        <h4>Setting</h4>
                    </div>
                    <div className={classes.navbar_two__one_one}>
                        <img src="/icon/help.svg" alt="Help" />
                        <h4>Help</h4>
                    </div>
                </nav>
            </div>
            <div className={classes.navbar_three}>
                <div className={classes.navbar_three_one}>
                    <div className={classes.navbar_three_one_one}>
                        <img src="/icon/user.svg" alt="User" />
                    </div>
                    <div className={classes.navbar_three_one_two}>
                        <h4>Anuj Kumar</h4>
                        <h5>anujkumar@gmail.com</h5>
                    </div>
                </div>
                <div className={classes.navbar_three_two}>
                    <h4>Logout</h4>
                </div>
            </div>
        </div >
    );
}

export default Navbar;