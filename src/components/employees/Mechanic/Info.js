import React from "react";
import classes from './Info.module.css';
import Options from "./Options";
import WelcomeSide from "./WelcomeSide";
import Quote from "./Quote";

const Info = () => {

    return (
        <div className={classes.infos}>
            <Quote />
            <div className={classes.info}>
                <Options />
                <WelcomeSide />
            </div>
        </div>
    );
}

export default Info;