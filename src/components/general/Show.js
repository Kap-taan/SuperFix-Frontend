import React from "react";
import classes from './Show.module.css'

const Show = () => {
    return (
        <div className={classes.show}>
            <img src="/media/show1.jpg" alt="Service 1" />
            <img src="/media/show2.jpg" alt="Service 2" className={classes.special} />
            <img src="/media/show3.jpg" alt="Service 3" />
        </div>
    );
}

export default Show;