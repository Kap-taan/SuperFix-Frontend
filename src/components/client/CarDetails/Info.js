import React from "react";
import classes from './Info.module.css';
import WelcomeSide from "../Dashboard/WelcomeSide";
import Quote from "../Dashboard/Quote";
import CarDetails from "./CarDetail";

const Info = () => {

    return (
        <div className={classes.infos}>
            <Quote />
            <div className={classes.info}>
                <CarDetails />
                <WelcomeSide />
            </div>
        </div>
    );
}

export default Info;