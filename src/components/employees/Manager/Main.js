import React from "react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import classes from './Main.module.css';

const ManagerDashboard = () => {



    return (
        <div className={classes.options}>
            <Link to="/employee/manager/offline">
                <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.1s' }}>
                    <div className={classes.option_img}>
                        <img src="/manager/offline.svg" alt="Vehicle" />
                    </div>
                    <div className={classes.option_content}>
                        <h5>Offline Slots</h5>
                    </div>
                </motion.div>
            </Link>
            <Link to="/employee/manager/online">
                <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.2s' }}>
                    <div className={classes.option_img}>
                        <img src="/manager/online.svg" alt="Book" />
                    </div>
                    <div className={classes.option_content}>
                        <h5>Online Slots</h5>
                    </div>
                </motion.div>
            </Link>
            <Link to="/employee/manager/emergencyslot">
                <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.3s' }}>
                    <div className={classes.option_img}>
                        <img src="/manager/emergency.svg" alt="Book" />
                    </div>
                    <div className={classes.option_content}>
                        <h5>Emergency Slots</h5>
                    </div>
                </motion.div>
            </Link>
            {/* <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.4s' }}>
                <div className={classes.option_img}>
                    <img src="/mechanic/product.svg" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    {service.id && shouldStart && <h5 onClick={addProductHandler}>Add Products</h5>}
                    {!service.id && <h5>Not Scheduled</h5>}
                    {!shouldStart && !isStarted && service.id && <h5>Not Scheduled</h5>}
                </div>
            </motion.div> */}
        </div>
    )
}

export default ManagerDashboard;