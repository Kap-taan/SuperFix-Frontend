import React, { useState } from "react";
import NavbarM from "./Navbar";
import Welcome from '../../client/Dashboard/Welcome';
import classes from './Offline.module.css';
import { collection, getDocs, doc, updateDoc, addDoc, setDoc } from "firebase/firestore";
import { db } from "../../../data/firebase";
import { async } from "@firebase/util";
import { json, useNavigate } from "react-router-dom";

const getCollName = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}${month}${year}`;
}

const Offline = () => {

    // State Variables
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [carNo, setCarNo] = useState('');
    const [details, setDetails] = useState({});
    const [issues, setIssues] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [options, setOptions] = useState({});

    const [mssg, setMssg] = useState('');
    const navigate = useNavigate();

    const [currStage, setCurrStage] = useState('info');

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('')

        // const response = await fetch('/api/auth/client/getinfo', {
        const response = await fetch('https://superfix-api.onrender.com/api/auth/client/getinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ carNo })
        })

        const json = await response.json();

        if (!response.ok) {
            setLoading(false);
            setError(json.error);
            console.log(json.error);

            return;
        }
        setDetails(json);
        console.log(json);
        setCurrStage('issues')
        // const collName = `${getCollName()}queues`;
        // offline online
        // console.log(collName);

        // const date = new Date();
        // const month = date.getMonth();
        // const year = date.getFullYear();
        // const day = date.getDate();
        // const limit = new Date(year, month, day, 12);

        // if (date > limit) {
        // Service will go in the Priority

        // }

        // Two cases before and after
        // queues (Highest Priority) (Hight Priority) (Priority)

        // Before the time i.e 13
        // const currDate = new Date();

        setLoading(false);

    }

    const issuesHandler = (e) => {
        e.preventDefault()
        setLoading(true);
        setIssues(e.target.issues.value.split(','));
        setLoading(false);
        setCurrStage('options')
    }

    const optionsHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { type, dryClean, polish, washing } = e.target;
        console.log(type.value, dryClean.value, washing.value, polish.value)
        const tempOptions = { type: type.value, dryClean: dryClean.value, washing: washing.value, polish: polish.value };
        setOptions(tempOptions);


        // demo start
        // let carNo = 'UP14BT0001'
        // const response1 = await fetch('/api/auth/client/getinfo', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ carNo })
        // })

        // const json = await response1.json();

        // if (!response1.ok) {
        //     setLoading(false);
        //     setError(json.error);
        //     console.log(json.error);

        //     return;
        // }
        // console.log(json);
        // setDetails(json);

        // demo end

        // We will get all the informations
        // Check the availability of the mechanic
        // Get the info of the mechanics
        const response = await getDocs(collection(db, 'mechanic'));
        let tempMechanics = [];
        response.forEach(doc => {
            tempMechanics = [...tempMechanics, {
                id: doc.id,
                available: doc.data().available
            }]
        })
        console.log(tempMechanics);
        const availableMechanics = tempMechanics.filter(mechanic => mechanic.available)
        console.log(availableMechanics);

        if (availableMechanics.length > 0) {
            // Mechanic is available
            // Update the mechanic document
            const mechanicRef = doc(db, "mechanic", availableMechanics[0].id);
            await updateDoc(mechanicRef, {
                available: false
            });
            const newService = {
                carNo: details.carNo,
                company: details.company,
                complete: false,
                date: getCollName(),
                email: details.email,
                endDate: '',
                entry: false,
                exceed: false,
                exit: false,
                isStarted: false,
                issues: issues,
                managed: true,
                mechanicId: availableMechanics[0].id,
                mechanicProducts: [],
                model: details.model,
                paid: false,
                reschedule: false,
                spareParts: [],
                status: 'Waiting for Vehicle',
                time: 'Offline',
                total: 0,
                userId: details._id,
                variant: details.variant,
                options: tempOptions,
                email: details.email
            }
            const docRef = await addDoc(collection(db, `${getCollName()}services`), newService);
            console.log("Document written with ID: ", docRef.id);
            console.log(details._id)
            await addDoc(collection(db, `${details._id}`), {
                collectionName: getCollName(),
                documentName: 'Offline',
                endDate: '',
                isDone: false,
                isStarted: false,
                issues: issues,
                mechanicId: availableMechanics[0].id,
                serviceId: docRef.id
            })
            // New Service is registered successfully
            console.log('New Service is registered with mechanic')
            setMssg('New Service is registered with mechanic')
            setLoading(false);
        } else {
            const newService = {
                carNo: details.carNo,
                company: details.company,
                complete: false,
                date: getCollName(),
                email: details.email,
                endDate: '',
                entry: false,
                exceed: false,
                exit: false,
                isStarted: false,
                issues: issues,
                managed: true,
                mechanicId: '',
                mechanicProducts: [],
                model: details.model,
                paid: false,
                reschedule: false,
                spareParts: [],
                status: 'Waiting for Vehicle',
                time: 'Offline',
                total: 0,
                userId: details._id,
                variant: details.variant,
                options: tempOptions
            }
            const docRef = await addDoc(collection(db, `${getCollName()}services`), newService);
            console.log("Document written with ID: ", docRef.id);

            // Adding this service to the Priority Queue
            await addDoc(collection(db, `${getCollName()}priority`), {
                serviceId: docRef.id,
                created_at: new Date(),
                isScheduled: false
            })

            await addDoc(collection(db, `${details._id}`), {
                collectionName: getCollName(),
                documentName: 'Offline',
                endDate: '',
                isDone: false,
                isStarted: false,
                issues: issues,
                mechanicId: '',
                serviceId: docRef.id
            })
            // New Service is registered successfully
            console.log('New Service is registered without mechanic')
            setMssg('New Service is registered without mechanic')
            setLoading(false);
        }
    }

    return (
        <div className={classes.dashboard}>
            <NavbarM />
            <div className={classes.infos}>
                <div className={classes.quote}>
                    <h3>Dashboard</h3>
                </div>
                <div className={classes.info}>
                    <div className={classes.details}>
                        {currStage === 'info' && <form onSubmit={submitHandler}>
                            <div className={classes.item}>
                                <label>Car No</label>
                                <input type="text" alt="UserId" value={carNo} onChange={e => setCarNo(e.target.value.toLocaleUpperCase())} />
                            </div>
                            <div className={classes.btns}>
                                {!loading && <button type="submit">Search</button>}
                                {loading && <h5>Loading...</h5>}
                                {error && <h5 style={{ marginTop: '12px', textAlign: 'center' }}>{error}</h5>}
                            </div>
                        </form>}
                        {currStage === 'issues' && <form onSubmit={issuesHandler}>
                            <div className={classes.item}>
                                <label>Issues</label>
                                <input type="text" name="issues" placeholder="Separated by commas" />
                            </div>
                            <div className={classes.btns}>
                                {!loading && <button type="submit">Next</button>}
                                {loading && <h5>Loading...</h5>}
                            </div>
                        </form>}
                        {currStage === 'options' && <div className={classes.result}>
                            <form className={classes.detailsForm} onSubmit={optionsHandler}>
                                <div className={classes.detailForm}>
                                    <h5>Type of Service</h5>
                                    <select name="type">
                                        <option value="basic">Basic</option>
                                        <option value="advance">Advance</option>
                                    </select>
                                </div>
                                <div className={classes.detailForm}>
                                    <h5>Dry Clean</h5>
                                    <select name="dryClean">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div className={classes.detailForm}>
                                    <h5>Polish</h5>
                                    <select name="polish">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div className={classes.detailForm}>
                                    <h5>Washing</h5>
                                    <select name="washing">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div>
                                    {!loading && !mssg && <button className={classes.btn}>Complete</button>}
                                    {loading && <h5>Loading...</h5>}
                                    {mssg && <h5 style={{ textAlign: 'center' }}>{mssg}</h5>}
                                    {mssg && <div className={classes.btns}>
                                        <button onClick={() => navigate('/employee/dashboard')}>Go Back</button>
                                    </div>}
                                </div>
                            </form>
                        </div>}
                    </div>
                    <Welcome />
                </div>
            </div>
        </div>
    );
}

export default Offline;