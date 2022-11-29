import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import classes from './CarDetail.module.css';

const CarDetails = () => {

    const { user } = useAuthContext();

    const [carNo, setCarNo] = useState('');
    const [variant, setVariant] = useState('');
    const [company, setCompany] = useState('');
    const [model, setModel] = useState('');

    useEffect(() => {
        if (user) {
            setCarNo(user.carNo);
            setCompany(user.company);
            setModel(user.model);
            setVariant(user.variant);
        }
    }, [user])

    return (
        <div className={classes.options}>
            <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.1s' }}>
                <div className={classes.option_img}>
                    <img src="/client/car.svg" alt="Vehicle" />
                </div>
                <div className={classes.option_content}>
                    <h5>{carNo}</h5>
                </div>
            </motion.div>
            <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.2s' }}>
                <div className={classes.option_img}>
                    <img src="/client/company.svg" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    {company && <h5>{company}</h5>}
                </div>
            </motion.div>
            <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.3s' }}>
                <div className={classes.option_img}>
                    <img src="/client/model.svg" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    {model && <h5>{model}</h5>}
                </div>
            </motion.div>
            <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.4s' }}>
                <div className={classes.option_img}>
                    <img src="/client/type.svg" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    {variant && <h5>{variant.toLocaleUpperCase()}</h5>}
                </div>
            </motion.div>
        </div>
    );
}

export default CarDetails;