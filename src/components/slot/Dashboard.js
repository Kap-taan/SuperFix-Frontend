import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../data/firebase';
import { useSlotContext } from '../../hooks/useSlotContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../client/Dashboard/Navbar';
import classes from './Dashboard.module.css';

const Slot = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [dates, setDates] = useState([]);
    const [times, setTimes] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const { user } = useAuthContext();

    const [uid, setUid] = useState('');
    const [carNo, setCarNo] = useState('');
    const [name, setName] = useState('');

    const { date, time, dispatch } = useSlotContext();

    const [step, setStep] = useState(1);

    // Time slots and Operational Units Pre Fetch
    // let timeSlots = ["10-11", "11-12", "1-2", "2-3", "3-4", "4-5"];
    // let operationalUnits = 3;
    const [timeSlots, setTimeSlots] = useState([]);
    const [operationalUnits, setOperationalUnits] = useState(0);

    // user id
    const [mechanic, setMechanic] = useState('');

    const [count, setCount] = useState([]);
    const [selectedIssues, setSelectedIssues] = useState([]);
    const [serviceId, setServiceId] = useState('');

    const [currStage, setCurrStage] = useState('date');

    useEffect(() => {

        // Getting the basic info
        getDocs(collection(db, "basicinfo")).then(docs => {
            let timeSlotts = [];
            let operationalUnitss;
            docs.forEach(doc => {
                timeSlotts = doc.data().timeSlots;
                operationalUnitss = doc.data().operationalUnits;
            })
            setTimeSlots(timeSlotts)
            // Only Half slots are available
            operationalUnitss = operationalUnitss / 2;
            setOperationalUnits(operationalUnitss)

        })

        // Making the next 7 days
        let tomorrow = new Date();
        let tempDates = [];
        // tempDates = [...tempDates, tomorrow.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })]
        for (let i = 0; i < 7; i++) {
            tomorrow.setDate(tomorrow.getDate() + 1);
            tempDates = [...tempDates, tomorrow.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })]
        }
        setDates(tempDates);
        // Getting the Previous Selected date
        const prevDate = localStorage.getItem(`Date${uid}`)
        if (prevDate) {
            setSelectedDate(prevDate);
            const prevTime = localStorage.getItem(`Time${uid}`)
            if (prevTime) {
                setSelectedTime(prevTime)
                let prevIssues = localStorage.getItem(`Issues${uid}`);
                if (prevIssues) {
                    prevIssues = JSON.parse(prevIssues);
                    setSelectedIssues(prevIssues)
                    const prevServiceId = localStorage.getItem(`serviceId${uid}`);
                    setServiceId(prevServiceId);
                    setCurrStage('details');
                    setStep(4);
                    return;
                }
                setCurrStage('issues');
                setStep(3);
                return;
            }
            setStep(2);
            setCurrStage('time');
        }



    }, [])

    useEffect(() => {
        // Setting up the user
        if (user) {
            setUid(user._id)
            console.log(user._id);
            setName(user.name)
            setCarNo(user.carNo)
        }

    }, [user])

    const dateHandler = async (e) => {
        e.preventDefault();
        console.log('I m here');
        const date = new Date(e.target.date.value)
        const splitText = date.toLocaleDateString().split('/');
        const dateTemp = `${splitText[0]}${splitText[1]}${splitText[2]}`;
        const result = `${splitText[0]}${splitText[1]}${splitText[2]}slots`
        console.log(result);
        // Extracting the data of that day
        getDocs(collection(db, result)).then(async docs => {
            if (docs.size === 0) {
                const docRef = collection(db, result);
                let timesTemp = [];
                timeSlots.forEach(async timeSlot => {
                    timesTemp = [...timesTemp, { value: timeSlot, count: 0 }]
                    await setDoc(doc(docRef, timeSlot), {
                        count: 0,
                        mechanics: []
                    })
                })
                setTimes(timesTemp);
            } else {
                let timesTemp = [];
                docs.forEach(doc => {
                    console.log(doc.id, doc.data().count);
                    if (!(doc.data().count >= operationalUnits)) {
                        timesTemp = [...timesTemp, { value: doc.id, count: doc.data().count }];
                    }
                })
                setTimes(timesTemp);
            }
        }).catch(err => {
            console.log(err);
        })
        setSelectedDate(dateTemp);
        setCurrStage('time')
        setStep(prevStep => prevStep + 1)
        dispatch({ type: 'DATE_SELECTED', payload: dateTemp })
        localStorage.setItem(`Date${uid}`, dateTemp);
    }

    const timeHander = async (e) => {
        e.preventDefault();
        // Setting up the Loading
        setLoading(true);
        // Getting the info of that time slot
        const timeData = times.filter(time => time.value === e.target.time.value)[0];
        // Incrementing the no of count of that day and timing
        console.log(timeData);
        setCount(parseInt(timeData.count) + 1);
        // Update the time slot
        console.log(selectedDate);
        await updateDoc(doc(db, `${selectedDate}slots`, e.target.time.value), {
            count: parseInt(timeData.count) + 1,
        });
        console.log('Updated Successfully');
        setCurrStage('issues');
        setLoading(false);
        setStep(prevStep => prevStep + 1)
        setSelectedTime(e.target.time.value);
        dispatch({ type: 'TIME_SELECTED', payload: e.target.time.value })
        localStorage.setItem(`Time${uid}`, e.target.time.value);
    }

    let add_minutes = function (dt, minutes) {
        return new Date(dt.getTime() + minutes * 60000);
    }

    const issueHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const issues = e.target.issues.value.split(',');
        console.log(issues);
        console.log(selectedTime);
        const endTime = parseInt(selectedTime.split('-')[1]);
        const endYear = selectedDate.substring(4, 8)
        const endMonth = selectedDate.substring(2, 4)
        const endDay = selectedDate.substring(0, 2)
        console.log(endTime, endYear, endMonth, endDay);
        let endDate = new Date(endYear, endMonth - 1, endDay, endTime)
        endDate = add_minutes(endDate, 10);
        console.log(endDate);
        // Add this to the collection of the day
        const data = {
            userId: uid,
            date: selectedDate,
            time: selectedTime,
            carNo: carNo,
            mechanicId: '',
            issues,
            entry: false,
            exit: false,
            status: "Waiting for Vehicle",
            isStarted: false,
            endDate: endDate,
            managed: false,
            exceed: false,
            reschedule: false,
            mechanicProducts: [],
            complete: false,
            spareParts: [],
            paid: false,
            total: 0,
            company: user.company,
            variant: user.variant,
            model: user.model,
            email: user.email
        }
        // const docDef = doc(collection(db, `${selectedDate}services`, `${selectedDate}${selectedTime.split('-')[0]}${selectedTime.split('-')[1]}${count}`));
        const docRef = doc(db, `${selectedDate}services`, `${selectedDate}${selectedTime.split('-')[0]}${selectedTime.split('-')[1]}${count}`);
        await setDoc(docRef, data);
        let serviceIDD = `${selectedDate}${selectedTime.split('-')[0]}${selectedTime.split('-')[1]}${count}`;
        // Service Id is registered in user collection
        const newwService = {
            serviceId: serviceIDD,
            collectionName: selectedDate,
            documentName: selectedTime,
            mechanicId: '',
            issues: issues,
            isDone: false,
            isStarted: false,
            endDate: endDate
        }
        const serviceDef = doc(collection(db, uid));
        await setDoc(serviceDef, newwService);
        console.log('New Service is registered');
        setCurrStage('details');
        setStep(prevStep => prevStep + 1)
        setSelectedIssues(issues);
        localStorage.setItem(`Issues${uid}`, JSON.stringify(issues));
        localStorage.setItem(`serviceId${uid}`, serviceIDD);
        dispatch({ type: 'ISSUES_SELECTED', payload: issues });
        dispatch({ type: 'ID_SELECTED', payload: serviceIDD });
        setLoading(false);
    }

    const detailHandler = async () => {
        dispatch({ type: 'REMOVE' })
        localStorage.removeItem(`Date${uid}`);
        localStorage.removeItem(`Time${uid}`);
        localStorage.removeItem(`serviceId${uid}`);
        localStorage.removeItem(`Issues${uid}`);
        navigate('/client/dashboard')
    }

    const cancelHandler = () => {
        dispatch({ type: 'REMOVE' })
        localStorage.removeItem(`Date${uid}`);
        localStorage.removeItem(`Time${uid}`);
        localStorage.removeItem(`serviceId${uid}`);
        localStorage.removeItem(`Issues${uid}`);
        navigate('/client/dashboard')
    }

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
                        <h2>Slot Booking</h2>
                        <p>Make your process of slot booking efficient and fast</p>
                    </div>
                    <div className={classes.body}>
                        <div className={classes.body_one}>
                            <div className={classes.body_one_one}>
                                <div className={classes.body_one_two}>
                                    <h5 className={currStage === 'date' ? `${classes.currentText}` : ''} >Select Date</h5>
                                    {/* <p>Day, Month date, year</p> */}
                                </div>
                                <img className={currStage === 'date' ? `${classes.currentImg}` : ''} src="/slot/date.svg" alt="Date" />
                            </div>
                            <div className={classes.body_one_one}>
                                <div className={classes.body_one_two}>
                                    <h5 className={currStage === 'time' ? `${classes.currentText}` : ''}>Select Time</h5>
                                </div>
                                <img className={currStage === 'time' ? `${classes.currentImg}` : ''} src="/slot/time.svg" alt="Date" />
                            </div>
                            <div className={classes.body_one_one}>
                                <div className={classes.body_one_two}>
                                    <h5 className={currStage === 'issues' ? `${classes.currentText}` : ''} >Issues</h5>
                                </div>
                                <img className={currStage === 'issues' ? `${classes.currentImg}` : ''} src="/slot/slot.svg" alt="Date" />
                            </div>
                            <div className={classes.body_one_one}>
                                <div className={classes.body_one_two}>
                                    <h5 className={currStage === 'details' ? `${classes.currentText}` : ''} >Details</h5>
                                </div>
                                <img className={currStage === 'details' ? `${classes.currentImg}` : ''} src="/slot/details.svg" alt="Date" />
                            </div>
                        </div>
                        <div className={classes.body_two}>
                            {currStage !== 'details' && <div className={classes.intro}>
                                <p>Step {step}/4</p>
                                <h3>Please enter the {currStage}</h3>
                                <p>Please fill your details carefully</p>
                            </div>}
                            {currStage === 'details' && <div className={classes.intro}>
                                <p>Step {step}/4</p>
                                <h3>Thank you for booking slot :)</h3>
                            </div>}
                            {currStage === 'date' && <motion.form onSubmit={dateHandler} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, type: 'tween', duration: 1 }} >
                                <label>Enter your prefered date</label>
                                <select name='date'>
                                    {dates && dates.map(date => (
                                        <option key={date}>{date}</option>
                                    ))}
                                </select>
                                <div className={classes.btn}>
                                    <motion.button type='submit'
                                        whileHover={{
                                            scale: 1.1,
                                            textShadow: "0px 0px 8px rgb(255,255,255)",
                                            boxShadow: "0px 0px 8px rgb(0,0,0)"
                                        }}
                                    >
                                        Next Step
                                    </motion.button>
                                    <motion.button onClick={cancelHandler} style={{ backgroundColor: 'red' }}
                                        whileHover={{
                                            scale: 1.1,
                                            textShadow: "0px 0px 8px rgb(255,255,255)",
                                            boxShadow: "0px 0px 8px rgb(0,0,0)"
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </motion.form>}
                            {currStage === 'time' && <motion.form onSubmit={timeHander} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, type: 'tween', duration: 1 }} >
                                <label>Enter your prefered time slot</label>
                                <select name='time'>
                                    {times[0] && times.map(time => (
                                        <option key={time.value} value={time.value}>{time.value}</option>
                                    ))}
                                </select>
                                {loading && <h4 style={{ textAlign: 'right', fontSize: '18px' }}>Loading...</h4>}
                                {!loading && <div className={classes.btn}>
                                    <motion.button type='submit'
                                        whileHover={{
                                            scale: 1.1,
                                            textShadow: "0px 0px 8px rgb(255,255,255)",
                                            boxShadow: "0px 0px 8px rgb(0,0,0)"
                                        }}
                                    >
                                        Next Step
                                    </motion.button>
                                    <motion.button onClick={cancelHandler} style={{ backgroundColor: 'red' }}
                                        whileHover={{
                                            scale: 1.1,
                                            textShadow: "0px 0px 8px rgb(255,255,255)",
                                            boxShadow: "0px 0px 8px rgb(0,0,0)"
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>}
                            </motion.form>}
                            {currStage === 'issues' && <motion.form onSubmit={issueHandler} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, type: 'tween', duration: 1 }} >
                                <input type="text" name="issues" placeholder='Issues (Separated by commas)' />
                                {loading && <h4 style={{ textAlign: 'right', fontSize: '18px' }}>Loading...</h4>}
                                {!loading && <div className={classes.btn}>
                                    <motion.button type='submit'
                                        whileHover={{
                                            scale: 1.1,
                                            textShadow: "0px 0px 8px rgb(255,255,255)",
                                            boxShadow: "0px 0px 8px rgb(0,0,0)"
                                        }}
                                    >
                                        Next Step
                                    </motion.button>
                                </div>}
                            </motion.form>}
                            {currStage === 'details' && <motion.div className={classes.details} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, type: 'tween', duration: 1 }} >
                                <div className={classes.detail}>
                                    <h5>Service ID</h5>
                                    <h4>{serviceId}</h4>
                                </div>
                                <div className={classes.detail}>
                                    <h5>Registered Name</h5>
                                    <h4>{name}</h4>
                                </div>
                                <div className={classes.detail}>
                                    <h5>Selected Date</h5>
                                    {/* <h4>{selectedDate}</h4> */}
                                    <h4>{`${selectedDate.substring(0, 2)}-${selectedDate.substring(2, 4)}-${selectedDate.substring(4, 8)}`}</h4>
                                </div>
                                <div className={classes.detail}>
                                    <h5>Selected Slot</h5>
                                    <h4>{selectedTime}</h4>
                                </div>
                                <div className={classes.detail}>
                                    <h5>Car No</h5>
                                    <h4>{carNo}</h4>
                                </div>
                                <div className={classes.detail}>
                                    <h5>Issues</h5>
                                    {selectedIssues && selectedIssues.map(issue => (<h4 key={issue}>{issue}</h4>))}
                                </div>
                                <div className={classes.btn}>
                                    <button onClick={detailHandler}>Finish</button>
                                </div>
                            </motion.div>}
                        </div>
                    </div>
                </motion.div >
            </div>
        </div >
    );
}

export default Slot;