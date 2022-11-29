import React from "react";
import classes from './Info.module.css';
import WelcomeSide from "./WelcomeSide";
import ManagerDashboard from "./Main";
import Quote from "./Quote";

const Info = () => {

    return (
        <div className={classes.infos}>
            <Quote />
            <div className={classes.info}>
                <ManagerDashboard />
                <WelcomeSide />
            </div>
        </div>
    );
}

export default Info;