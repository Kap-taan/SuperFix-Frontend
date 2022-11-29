import React from "react";
import Welcome from "./Welcome";
import classes from './WelcomeSide.module.css';

const WelcomeSide = () => {
    return (
        <div className={classes.welcomeside}>
            <Welcome />
        </div>
    )
}

export default WelcomeSide;