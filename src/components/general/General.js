import React from 'react'
import Navbar from './Navbar'
import classes from './General.module.css'
import Home from './Home'
import Show from './Show'
import Features from './Features'
import Footer from './Footer'

const General = () => {
    return (
        <div className={classes.general}>
            <Navbar />
            <Home />
            <Show />
            {/* <Features /> */}
            <Footer />
        </div>
    )
}

export default General;