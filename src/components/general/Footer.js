import React from "react";
import classes from './Footer.module.css'

const Footer = () => {
    const currYear = new Date().getFullYear();
    return (
        <div className={classes.footer}>
            &#169; Copyright {currYear}
            {/* <p><marquee>Designed and Coded by Harsh</marquee></p> */}
        </div>
    );
}

export default Footer;