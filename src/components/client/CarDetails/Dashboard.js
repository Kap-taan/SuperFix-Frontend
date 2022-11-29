import React from 'react';
import classes from './Dashboard.module.css';
import Info from './Info';
import Navbar from '../Dashboard/Navbar';

const CarDetail = () => {
    return (
        <div className={classes.dashboard}>
            <Navbar />
            <Info />
        </div>
    );
}

export default CarDetail;
