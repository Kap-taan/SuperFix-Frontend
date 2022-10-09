import React from "react";
import classes from './Options.module.css';

const Options = () => {
    return (
        <div className={classes.options}>
            <div className={classes.option}>
                <div className={classes.option_img}>
                    <img src="/media/vehicle.svg" alt="Vehicle" />
                </div>
                <div className={classes.option_content}>
                    <h5>UP98BU</h5>
                    <h3>3498</h3>
                </div>
            </div>
            <div className={classes.option}>
                <div className={classes.option_img}>
                    <img src="/media/book.svg" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    <h5>Book a</h5>
                    <h3>Slot</h3>
                </div>
            </div>
            <div className={classes.option}>
                <div className={classes.option_img}>
                    <img src="/media/livestream.svg" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    <h5>Watch the</h5>
                    <h3>Livestream</h3>
                </div>
            </div>
            <div className={classes.option}>
                <div className={classes.option_img}>
                    <img src="/media/status.svg" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    <h5>Status</h5>
                    <h3>"Servicing"</h3>
                </div>
            </div>
        </div>
    );
}

export default Options;