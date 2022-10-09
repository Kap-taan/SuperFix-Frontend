import React from 'react'
import { Link } from 'react-router-dom';
import classes from './Home.module.css'

const Home = () => {

    return (
        <div className={classes.home}>
            <div className={classes.home_one}>
                <h5>Take Charge of your time</h5>
                <h3>A car is not only a vehicle.<br />Sometimes it’s just like a dream</h3>
                <p>A motor vehicle service or tune-up is a series of maintenance procedures carried out at a set time interval or after the vehicle has traveled a certain distance.</p>
                <Link to="/client/signup"><button className={classes.get_started}>Get Started</button></Link>
            </div>
            <div className={classes.home_two}>
                <img src="/media/service1.jpg" alt="Car Service 1" className={classes.img1} />
                <img src="/media/service2.jpg" alt="Car Service 2" className={classes.img2} />
                <img src="/media/service3.jpg" alt="Car Service 3" className={classes.img3} />
            </div>
        </div>
    )
}

export default Home;