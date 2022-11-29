import React from 'react';
import classes from './Dashboard.module.css';
import Info from './Info';
import Navbar from './Navbar';

const Client = () => {
    return (
        <div className={classes.dashboard}>
            <Navbar />
            <Info />
        </div>
    );
}

export default Client;
