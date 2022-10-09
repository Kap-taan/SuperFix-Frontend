import React from "react";
import classes from './Info.module.css';
import back from '../img/b10.svg';
import Welcome from "./Welcome";
import Options from "./Options";
import WelcomeSide from "./WelcomeSide";

const Info = () => {
    return (
        <div className={classes.info}>
            <div className={classes.info_one}>
                {/* <h2>A Moments of Caring Your Car.</h2> */}
            </div>
            <Options />
            <WelcomeSide />
        </div>
    );
}

export default Info;