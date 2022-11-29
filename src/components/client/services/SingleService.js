import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from '../../../data/firebase';
import { useAuthContext } from "../../../hooks/useAuthContext";
import { motion } from "framer-motion";
import Navbar from "../Dashboard/Navbar";

import classes from './SingleService.module.css'
import { useParams } from "react-router-dom";

const SingleService = () => {

    const { user } = useAuthContext();

    const { collName, serviceId } = useParams();

    const [service, setService] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        setLoading(true);
        if (user) {
            getDoc(doc(db, `${collName}services`, serviceId)).then((response) => {
                console.log(response.data())
                setService(response.data());
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            })
        }

    }, [user])

    return (
        <div className={classes.dashboard}>
            <Navbar />
            <div className={classes.infos}>
                <motion.div className={classes.slot}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* <div className={classes.navbar}>
                        <h2>Service</h2>
                        <p>Make your process of slot booking efficient and fast</p>
                    </div> */}
                    {loading && <div className={classes.info}><div className={classes.details}><h3 style={{ textAlign: 'center' }}>Loading...</h3></div></div>}
                    {service.carNo && <div className={classes.info}>
                        <div className={classes.details}>
                            <div className={classes.detail}>
                                <h5>Car No</h5>
                                <h3>{service.carNo}</h3>
                            </div>
                            <div className={classes.detail}>
                                <h5>Time Slot</h5>
                                <h3>{service.time}</h3>
                            </div>
                            <div className={classes.detail}>
                                <h5>Status</h5>
                                <h3>{service.status}</h3>
                            </div>
                            <div className={classes.detail}>
                                <h5>Amount</h5>
                                <h3>{service.total}</h3>
                            </div>
                            <div className={classes.detail}>
                                <h5>Issues</h5>
                                {service.issues && service.issues.map(issue => (
                                    <h3 key={issue}>{issue}</h3>
                                ))}
                            </div>
                            <div className={classes.detail}>
                                <h5>Options</h5>
                                {service.options.type && <h3>Type: {service.options.type.toUpperCase()}</h3>}
                                {service.options.washing && <h3>Washing: {service.options.washing.toUpperCase()}</h3>}
                                {service.options.polish && <h3>Polish: {service.options.polish.toUpperCase()}</h3>}
                                {service.options.dryClean && <h3>Dry Clean: {service.options.dryClean.toUpperCase()}</h3>}
                            </div>
                            <div className={classes.detail}>
                                <h5 style={{ marginBottom: '30px' }}>Products Replaced</h5>
                                <div className={classes.detailProduct}>
                                    {service.mechanicProducts && service.mechanicProducts.map(product => (
                                        <div className={classes.singleProduct}>
                                            <h5>Name : <span>{product.name}</span></h5>
                                            <h5>Quantity : <span>{product.quantity} Piece</span></h5>
                                            <img src={product.url} alt="Product" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>}
                </motion.div>
            </div>
        </div >
    );
}

export default SingleService;