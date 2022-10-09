import React from "react";
import image from '../img/back6.jpg';
import classes from './Features.module.css'

const Features = () => {
    return (
        <div className={classes.features} style={{ backgroundImage: `url(${image})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
            <h2>A million different reasons for you to choose us</h2>
            <p>Typically, minor services are generally performed at 7,500, 15,000, 45,000 and 75,000 miles while major services are performed at 30,000, 60,000 and 90,000-mile intervals.</p>
            <div className={classes.main_features}>
                <div className={classes.main_feature}>
                    <img src="/media/fast.svg" alt="Feature" />
                    <h3>Fast and Efficient</h3>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div className={classes.main_feature}>
                    <img src="/media/detailed.svg" alt="Feature" />
                    <h3>Detailed Service</h3>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div className={classes.main_feature}>
                    <img src="/media/fast.svg" alt="Feature" />
                    <h3>Fast and Efficient</h3>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Features;