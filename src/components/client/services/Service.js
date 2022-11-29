import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from '../../../data/firebase';
import { useAuthContext } from "../../../hooks/useAuthContext";
import { motion } from "framer-motion";
import Navbar from "../Dashboard/Navbar";
import { Link } from 'react-router-dom';
import classes from './Service.module.css'

const Services = () => {

    const { user } = useAuthContext();
    const [future, setFuture] = useState([]);
    const [past, setPast] = useState([]);
    const [present, setPresent] = useState([]);

    const [loading, setLoading] = useState(false);

    const [currStage, setCurrStage] = useState('Upcoming');

    const getData = async (user) => {
        setLoading(true);
        const serviceQuery = query(collection(db, user._id))
        const snapshot = await getDocs(serviceQuery);
        let futureTemp = [];
        let pastTemp = [];
        let presentTemp = [];
        snapshot.forEach(doc => {
            if (doc.data().isDone === true) {
                pastTemp = [...pastTemp, {
                    id: doc.id,
                    serviceId: doc.data().serviceId,
                    collName: doc.data().collectionName,
                    date: `${doc.data().collectionName.substring(0, 2)}-${doc.data().collectionName.substring(2, 4)}-${doc.data().collectionName.substring(4, 9)}`,
                    created_at: new Date(parseInt(`${doc.data().collectionName.substring(4, 9)}`), parseInt(`${doc.data().collectionName.substring(2, 4)}`) - 1, parseInt(`${doc.data().collectionName.substring(0, 2)}`))
                }]
            }
            else if (doc.data().isStarted === false) {
                futureTemp = [...futureTemp, {
                    id: doc.id,
                    serviceId: doc.data().serviceId,
                    collName: doc.data().collectionName,
                    date: `${doc.data().collectionName.substring(0, 2)}-${doc.data().collectionName.substring(2, 4)}-${doc.data().collectionName.substring(4, 9)}`,
                    created_at: new Date(parseInt(`${doc.data().collectionName.substring(4, 9)}`), parseInt(`${doc.data().collectionName.substring(2, 4)}`) - 1, parseInt(`${doc.data().collectionName.substring(0, 2)}`))
                }]
            }
            // else if (doc.data().isDone === false && doc.data().isStarted === true) {
            //     presentTemp = [...presentTemp, {
            //         id: doc.id,
            //         serviceId: doc.data().serviceId,
            //         date: `${doc.data().collectionName.substr(0, 1)}-${doc.data().collectionName.substr(2, 3)}-${doc.data().collectionName.substr(4, 5)}`
            //     }]
            // }
        })

        futureTemp.sort((a, b) => a.created_at > b.created_at);
        setFuture(futureTemp);
        pastTemp.sort((a, b) => a.created_at > b.created_at)
        setPast(pastTemp);

        setLoading(false);

        console.log(pastTemp);
        // console.log(presentTemp);
        console.log(futureTemp);

    }

    useEffect(() => {

        if (user) {
            getData(user);
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
                    <div className={classes.navbar}>
                        <h2>Services</h2>
                        <p>Make your process of slot booking efficient and fast</p>
                    </div>
                    <div className={classes.body}>
                        <div className={classes.body_one}>
                            {/* <div className={classes.body_one_one}>
                                <div className={classes.body_one_two}>
                                    <h5 className={currStage === 'Ongoing' ? `${classes.currentText}` : ''} >Ongoing Service</h5>
                                </div>
                                <img className={currStage === 'Ongoing' ? `${classes.currentImg}` : ''} src="/slot/date.svg" alt="Date" />
                            </div> */}
                            <div className={classes.body_one_one} onClick={() => setCurrStage('Upcoming')}>
                                <div className={classes.body_one_two}>
                                    <h5 className={currStage === 'Upcoming' ? `${classes.currentText}` : ''}>Upcoming Services</h5>
                                </div>
                                <img className={currStage === 'Upcoming' ? `${classes.currentImg}` : ''} src="/slot/time.svg" alt="Date" />
                            </div>
                            <div className={classes.body_one_one} onClick={() => setCurrStage('Already Done')}>
                                <div className={classes.body_one_two}>
                                    <h5 className={currStage === 'Already Done' ? `${classes.currentText}` : ''} >Already Done Services</h5>
                                </div>
                                <img className={currStage === 'Already Done' ? `${classes.currentImg}` : ''} src="/slot/slot.svg" alt="Date" />
                            </div>

                        </div>
                        <div className={classes.body_two}>
                            <div className={classes.intro}>
                                <h3>{currStage} Services</h3>
                            </div>

                            {currStage === 'Ongoing' && <motion.div className={classes.list} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, type: 'tween', duration: 1 }}>
                                {present && present.map(service => (
                                    <div className={classes.service} key={service.serviceId}>
                                        <p>{service.date}</p>
                                        <h3>{service.serviceId}</h3>
                                    </div>
                                ))}
                                {!present.length && <div style={{ marginBottom: '50px' }}>No Ongoing Services</div>}
                                <div className={classes.btn}>
                                    <motion.button
                                        onClick={() => setCurrStage('Upcoming')}
                                        whileHover={{
                                            scale: 1.1,
                                            textShadow: "0px 0px 8px rgb(255,255,255)",
                                            boxShadow: "0px 0px 8px rgb(0,0,0)"
                                        }}
                                    >
                                        Next Step
                                    </motion.button>
                                </div>
                            </motion.div>}


                            {currStage === 'Upcoming' && <motion.div className={classes.list} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, type: 'tween', duration: 1 }}>
                                {future && future.map(service => (
                                    <Link to={`/client/service/${service.collName}/${service.serviceId}`} key={service.id}>
                                        <div className={classes.service}>
                                            <p>{service.date}</p>
                                            <h3>{service.serviceId}</h3>
                                        </div>
                                    </Link>
                                ))}
                                {!future.length && !loading && <div style={{ marginBottom: '50px' }}>No Upcoming Services</div>}
                                {loading && <h4 className="loading">Loading...</h4>}
                            </motion.div>}

                            {/* {currStage === 'Upcoming' && <div className={classes.btn}> */}
                            {/* <motion.button
                                    onClick={() => setCurrStage('Already Done')}
                                    whileHover={{
                                        scale: 1.1,
                                        textShadow: "0px 0px 8px rgb(255,255,255)",
                                        boxShadow: "0px 0px 8px rgb(0,0,0)"
                                    }}
                                >
                                    Next Step
                                </motion.button> */}
                            {/* <motion.button onClick={() => setCurrStage('Ongoing')} style={{ backgroundColor: 'red' }}
                                        whileHover={{
                                            scale: 1.1,
                                            textShadow: "0px 0px 8px rgb(255,255,255)",
                                            boxShadow: "0px 0px 8px rgb(0,0,0)"
                                        }}
                                    >
                                        Back Step
                                    </motion.button> */}
                            {/* </div>} */}


                            {currStage === 'Already Done' && <motion.div className={classes.list} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, type: 'tween', duration: 1 }}>
                                {past && past.map(service => (
                                    <Link to={`/client/service/${service.collName}/${service.serviceId}`} key={service.serviceId}>
                                        <div className={classes.service}>
                                            <p>{service.date}</p>
                                            <h3>{service.serviceId}</h3>
                                        </div>
                                    </Link>
                                ))}
                                {!past.length && <div style={{ marginBottom: '50px' }}>No Already Done Services</div>}
                            </motion.div>}

                            {/* {currStage === 'Already Done' && <div className={classes.btn}>
                                <motion.button onClick={() => setCurrStage('Upcoming')} style={{ backgroundColor: 'red' }}
                                    whileHover={{
                                        scale: 1.1,
                                        textShadow: "0px 0px 8px rgb(255,255,255)",
                                        boxShadow: "0px 0px 8px rgb(0,0,0)"
                                    }}
                                >
                                    Back Step
                                </motion.button>
                            </div>} */}

                        </div>
                    </div>
                </motion.div>
            </div>
        </div >
    );
}

export default Services;