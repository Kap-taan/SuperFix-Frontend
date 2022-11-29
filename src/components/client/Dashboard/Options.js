import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../../data/firebase';
import classes from './Options.module.css';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import LiveStream from "../../Livestream/LiveStream";

const Options = () => {

    const { user } = useAuthContext();

    const [carNo, setCarNo] = useState('');
    const [userId, setUserId] = useState('');
    const [isThere, setIsThere] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const [currStage, setCurrStage] = useState('details');

    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState('');

    const [serviceId, setServiceId] = useState('');

    const navigate = useNavigate();

    const getCurrentService = async (collectionName, data) => {

        if (data) {
            setIsThere(true);
            const docRef = doc(db, `${collectionName}services`, data.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStatus(docSnap.data().status)
                setIsStarted(docSnap.data().isStarted)
                setLoading(false);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                setLoading(false);
            }

        }

        setLoading(false);
        setServiceId(data.id);
    }


    const liveHandler = () => {
        navigate(`/client/livestream/${serviceId}`)
    }

    const getDataOfService = async (id) => {
        const collectionName = `${new Date().toLocaleDateString().substring(0, 2)}${new Date().toLocaleDateString().substring(3, 5)}${new Date().toLocaleDateString().substring(6, 10)}`;
        // const collectionName = '18102022';
        console.log(collectionName);
        const docSnap = await getDocs(query(collection(db, `${collectionName}services`), where("userId", "==", id)));
        let data = [];

        docSnap.forEach(doc => {
            // collectionName, documentName
            if (!doc.data().reschedule) {
                data = [...data, {
                    id: doc.id
                }]
            }
        })
        return getCurrentService(collectionName, data[data.length - 1]);
    }

    useEffect(() => {
        if (user) {
            console.log(user)
            setCarNo(user.carNo);
            console.log(user._id);
            const id = user._id;
            setUserId(user._id);
            getDataOfService(id);
        }
    }, [user])

    return (
        <div className={classes.options}>
            {currStage === 'details' && <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.1s' }}>
                <div className={classes.option_img}>
                    <img src="/client/car.svg" alt="Vehicle" />
                </div>
                <div className={classes.option_content}>
                    <h6>Car No.</h6>
                    <h5>{carNo}</h5>
                    <h6>(UserId) {userId}</h6>
                </div>
            </motion.div>}
            {currStage === 'details' && <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.2s' }}>
                <div className={classes.option_img}>
                    <img src="/client/id.svg" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    <h6>(Today's Booked Service Id)</h6>
                    {isThere && <h5>{serviceId}</h5>}
                    {loading && <h5>Loading...</h5>}
                    {!loading && !isThere && <h5>Not Scheduled</h5>}
                </div>
            </motion.div>}
            {currStage === 'details' && <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.3s' }}>
                <div className={classes.option_img}>
                    {(isThere && isStarted) && <img src="/client/livestream.svg" alt="Book" />}
                    {!isThere && <img src="/client/novideo.svg" alt="Book" />}
                    {(isThere && !isStarted) && <img src="/client/novideo.svg" alt="Book" />}
                </div>
                <div className={classes.option_content}>
                    {loading && <h5>Loading...</h5>}
                    {!loading && (isThere && isStarted) && <h5 onClick={liveHandler}>Livestream</h5>}

                    {!loading && (isThere && !isStarted) && <h5>No Livestream</h5>}
                    {!loading && !isThere && <h5>Not Scheduled</h5>}
                </div>
            </motion.div>}
            {currStage === 'details' && <motion.div className={classes.option} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: '0.4s' }}>
                <div className={classes.option_img}>
                    <img src="/client/progress.png" alt="Book" />
                </div>
                <div className={classes.option_content}>
                    <h6>(Today's Booked Service Status)</h6>
                    {loading && <h5>Loading...</h5>}
                    {!loading && isThere && <h5>{status}</h5>}
                    {!loading && !isThere && <h5>Not Scheduled</h5>}
                </div>
            </motion.div>}
            {currStage === 'live' && <LiveStream type="client" id={serviceId} />}
        </div>
    );
}

export default Options;