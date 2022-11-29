import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../../data/firebase";
import NavbarM from "./Navbar";
import Welcome from '../../client/Dashboard/Welcome';
import classes from './Online.module.css';
import { useNavigate } from "react-router-dom";

const getCollName = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}${month}${year}`;
}

const compare = (a, b) => {
    return -1 * (parseInt(a.time.split('-')[0]) - parseInt(b.time.split('-')[1]))
}

const Online = () => {

    const [carNo, setCarNo] = useState('');

    const [currStage, setCurrStage] = useState('search');
    const [service, setService] = useState([]);
    const [options, setOptions] = useState({});

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState('');

    const navigate = useNavigate();

    const searchHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        console.log(carNo);
        const q = query(collection(db, `${getCollName()}services`), where('carNo', '==', carNo))
        const response = await getDocs(q);
        let tempServices = [];
        response.forEach(doc => {
            tempServices = [...tempServices, {
                ...doc.data(),
                id: doc.id
            }]
        })
        console.log(tempServices);
        if (tempServices <= 0) {
            // No service found 
            setLoading(false);
            setError('There is no booking for today');
            return;
        }
        tempServices = tempServices.filter(service => service.time !== 'Offline');
        console.log(tempServices);
        tempServices.sort(compare);
        // Latest Service
        setService(tempServices[0]);
        if (tempServices[0].entry === false) {
            setError('Entry is not marked');
            setLoading(false);
            return;
        }
        if (tempServices[0].managed === true) {
            setError('Already Managed')
            setLoading(false);
            return;
        }
        setLoading(false);
        setCurrStage('result');
    }

    const clickHandler = () => {
        setLoading(true);
        setCurrStage('options')
        setLoading(false);
    }

    const optionsHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        const { type, dryClean, polish, washing } = e.target;
        console.log(type.value, dryClean.value, washing.value, polish.value)
        const tempOptions = { type: type.value, dryClean: dryClean.value, washing: washing.value, polish: polish.value };
        setOptions(tempOptions);
        // Finding the mechanic
        const response = await getDocs(collection(db, 'mechanic'))
        let tempMechanics = []
        response.forEach(doc => {
            tempMechanics = [...tempMechanics, {
                id: doc.id,
                available: doc.data().available
            }]
        })
        let availableMechanics = tempMechanics.filter(mechanic => mechanic.available)
        if (availableMechanics.length > 0) {
            // Mechanic is available
            // Mechanic field is to be changed and options is to be added
            // Update the mechanic availability
            await updateDoc(doc(db, 'mechanic', availableMechanics[0].id), {
                available: false
            })
            await updateDoc(doc(db, `${getCollName()}services`, service.id), {
                mechanicId: availableMechanics[0].id,
                options: tempOptions
            })
            console.log('Service is booked with a mechanic')
            setStatus('Service is booked with a mechanic')
        } else {
            // Mechanic is not avaiable
            let highpriority = {
                created_at: new Date(),
                isScheduled: false,
                serviceId: service.id
            }
            // This will be of higher priority
            await addDoc(collection(db, `${getCollName()}highpriority`), highpriority)
            await updateDoc(doc(db, `${getCollName()}services`, service.id), {
                options: tempOptions
            })
            console.log('Service is booked without a mechanic')
            setStatus('Service is booked without a mechanic');
        }
        setLoading(false);
        setCurrStage('complete')

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
                        {currStage === 'search' && <form onSubmit={searchHandler}>
                            <div className={classes.item}>
                                <label>Car No</label>
                                <input type="text" value={carNo} onChange={e => setCarNo(e.target.value.toLocaleUpperCase())} />
                            </div>
                            <div className={classes.btns}>
                                {!loading && <button type="submit">Search</button>}
                                {loading && <h5>Loading...</h5>}
                            </div>
                        </form>}
                        {error && <h5 style={{ textAlign: 'center' }}>{error}</h5>}
                        {currStage === 'result' && <div className={classes.result}>
                            {!service.carNo && <div className={classes.error}>No Service Found</div>}
                            {service.carNo && <div className={classes.details}>
                                {/* <h3 className={classes.heading}>Service Details</h3> */}
                                <div className={classes.detail}>
                                    <h5>Car No</h5>
                                    <h3>{service.carNo}</h3>
                                </div>
                                <div className={classes.detail}>
                                    <h5>Time Slot</h5>
                                    <h3>{service.time}</h3>
                                </div>
                                <div className={classes.detail}>
                                    <h5>Mechanic Id</h5>
                                    <h3>{service.mechanicId}</h3>
                                </div>
                                <div className={classes.detail}>
                                    <h5>Issues</h5>
                                    {service.issues && service.issues.map(issue => (
                                        <h3 key={issue}>{issue}</h3>
                                    ))}
                                </div>
                                <div className={classes.btns}>
                                    {!loading && <button className={classes.btn} onClick={clickHandler}>Continue</button>}
                                    {loading && <h5>Loading...</h5>}
                                </div>
                            </div>}
                        </div>}
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
                                    {!loading && <button className={classes.btn}>Complete</button>}
                                    {loading && <h5>Loading...</h5>}
                                </div>
                            </form>
                        </div>}
                        {currStage === 'complete' && <div>
                            <div>{status}</div>
                            <button onClick={() => navigate('/employee/dashboard')}>Go Back</button>
                        </div>}
                    </div>
                    <Welcome />
                </div>
            </div>
        </div>
    )
}

export default Online;