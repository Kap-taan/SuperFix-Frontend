import { async } from "@firebase/util";
import { collection, doc, getDoc, getDocs, query, updateDoc, where, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../data/firebase";
import classes from './Work.module.css';

const getCollName = () => {
    // Getting the Collection Name
    const date = new Date()
    const splitText = date.toLocaleDateString().split('/');
    const dateTemp = `${splitText[0]}${splitText[1]}${splitText[2]}`;
    const result = `${splitText[0]}${splitText[1]}${splitText[2]}services`
    return result;
}

const getServiceDetails = async (collName, carNo) => {
    // collName = '08112022services'
    console.log(collName);
    console.log(carNo)
    const q = query(collection(db, collName), where("carNo", "==", carNo))
    const response = await getDocs(q);
    let data = []
    response.forEach(doc => {
        data = [...data, { id: doc.id, userId: doc.data().userId, limit: doc.data().endDate, managed: doc.data().managed, carNo: doc.data().carNo, endDate: doc.data().endDate, entry: doc.data().entry, issues: doc.data().issues, time: doc.data().time, mechanicId: doc.data().mechanicId, reschedule: doc.data().reschedule }]
        // console.log(new Date(data.endDate.toDate()).toTimeString().split(':')[0])
        return data;
    })

    return data;
}

const WorkM = () => {

    const [carNo, setCarNo] = useState('');
    const [currStage, setCurrStage] = useState('starting')
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState({});
    const [options, setOptions] = useState({});
    const [collName, setCollName] = useState('');
    const [serviceError, setServiceError] = useState('')
    const [times, setTimes] = useState([]);
    const [usedMechanics, setUsedMechanics] = useState([])

    const [timeSlots, setTimeSlots] = useState([]);
    const [operationalUnits, setOperationalUnits] = useState(0);

    const [allMechanics, setAllMechanics] = useState([]);

    const [allServices, setAllServices] = useState([]);
    const [collideSlots, setCollideSlots] = useState([]);

    useEffect(() => {
        const tempCollName = getCollName();
        console.log('I m here')
        // setCollName(tempCollName);
        // Getting the basic info
        getDocs(collection(db, "basicinfo")).then(docs => {
            let timeSlotts = [];
            let operationalUnitss;
            docs.forEach(doc => {
                timeSlotts = doc.data().timeSlots;
                operationalUnitss = doc.data().operationalUnits;
            })
            setTimeSlots(timeSlotts)
            setOperationalUnits(operationalUnitss)
        })

        // Getting all the mechanics
        getDocs(collection(db, "mechanic")).then(docs => {
            let tempMechanics = [];
            docs.forEach(doc => {
                tempMechanics = [...tempMechanics, doc.id]
            })
            console.log(tempMechanics)
            setAllMechanics(tempMechanics);
        })
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const collName = getCollName();
        let tempService = await getServiceDetails(collName, carNo);
        if (tempService.length === 0) {
            setServiceError('NO service registered');
            setLoading(false);
            return;
        }
        if (tempService.length > 1) {
            setAllServices(tempService);
            console.log(tempService)
            let tempCollideSlots = [];
            tempService.forEach(service => {
                tempCollideSlots = [...tempCollideSlots, service.time]
            })
            console.log(tempCollideSlots)
            setCollideSlots(tempCollideSlots);
            setCurrStage('collide')
            setLoading(false);
            return;
        }
        tempService = tempService[0]
        setService(tempService);
        // if (!tempService) {
        //     setCurrStage('starting')
        //     setCurrStage('result')
        //     return;
        // }
        if (!tempService.entry) {
            setServiceError('Entry is not Marked')
            setLoading(false);
            return;
        }
        if (tempService.managed) {
            setCurrStage('starting')
            setServiceError('Already Completed')
            setLoading(false);
            return;
        }
        if (new Date(tempService.endDate.toDate()) < new Date()) {
            // if (new Date() <= new Date()) {

            setCurrStage('starting')
            const selectedDate = getCollName();
            // const selectedDate = '08112022services'
            // console.log(selectedDate);
            // console.log(tempService.id)
            await updateDoc(doc(db, selectedDate, tempService.id), {
                exceed: true,
                status: 'Cancelled'
            });

            setServiceError('Time Limit Exceeds')
            setLoading(false);
            return
        }

        console.log(tempService);
        setLoading(false);
        setCurrStage('result');
    }

    const clickHandler = () => {
        setCurrStage('options')
    }

    const optionsHandler = async (e) => {
        e.preventDefault()
        const { type, dryClean, polish, washing } = e.target;
        console.log(type.value, dryClean.value, washing.value, polish.value)
        const tempOptions = { type: type.value, dryClean: dryClean.value, washing: washing.value, polish: polish.value };
        setOptions(tempOptions);
        const serviceRef = doc(db, getCollName(), service.id)
        const doC = await updateDoc(serviceRef, {
            options: tempOptions,
            status: 'Waiting for Mechanic',
            managed: true
        })
        setCurrStage('complete')
    }

    const completeHandler = () => {
        setOptions({})
        setCarNo('')
        setServiceError('')
        setCurrStage('starting')
    }

    const rescheduleHandler = async () => {

        console.log(service)
        console.log(service.reschedule)
        if (service.reschedule) {
            console.log('I m here')
            setServiceError('Already Rescheduled')
            setCurrStage('starting')
            return;
        }

        const remainingSlotDocument = new Date().toTimeString().split(':')[0]
        // Get the Collection Name
        const date = new Date()
        const splitText = date.toLocaleDateString().split('/');
        const dateTemp = `${splitText[0]}${splitText[1]}${splitText[2]}`;
        const result = `${splitText[0]}${splitText[1]}${splitText[2]}slots`
        // const result = `08112022slots`
        // const dateTemp = `08112022`

        console.log(result);
        // List of slots next to it
        let remainingSlot = []
        // const snapshot = await getDoc(doc(db, "rescheduling", remainingSlotDocument))
        console.log(remainingSlotDocument);
        const snapshot = await getDoc(doc(db, "rescheduling", remainingSlotDocument))
        if (snapshot.exists()) {
            // doc.data()
            remainingSlot = snapshot.data().values;
        }
        console.log(remainingSlot);
        if (remainingSlot.length === 0) {
            setServiceError('Store is closed')
            setCurrStage('starting')
            return;
        }
        // Getting the status of that day
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
                setTimes(remainingSlot);
            } else {
                let timesTemp = [];
                let usedMechanicsTemp = []
                console.log(operationalUnits);
                docs.forEach(doc => {
                    console.log(doc.id, doc.data().count);
                    if (!(doc.data().count >= operationalUnits)) {
                        if (remainingSlot.includes(doc.id)) {
                            timesTemp = [...timesTemp, { value: doc.id, count: doc.data().count }];
                            usedMechanicsTemp = [...usedMechanicsTemp, {
                                slot: doc.id,
                                mechanics: doc.data().mechanics
                            }]
                        }
                    }
                })
                setTimes(timesTemp);
                console.log(timesTemp);
                setUsedMechanics(usedMechanicsTemp);
                console.log(usedMechanicsTemp);
            }
        }).catch(err => {
            console.log(err);
        })

        setCurrStage('timeslot')
        setServiceError('')

    }

    const timeHandler = async (e) => {
        e.preventDefault();
        const date = new Date()
        const splitText = date.toLocaleDateString().split('/');
        const dateTemp = `${splitText[0]}${splitText[1]}${splitText[2]}`;
        const selectedDate = `${splitText[0]}${splitText[1]}${splitText[2]}`
        // const selectedDate = `08112022`

        const timeData = times.filter(time => time.value === e.target.time.value)[0];
        // Incrementing the no of count of that day and timing
        // console.log(timeData);
        // Finding the mechanic
        let mechanics;
        if (usedMechanics.length > 0) {
            mechanics = usedMechanics.filter(slot => slot.slot === timeData.value)[0].mechanics;
        } else {
            mechanics = []
        }
        const vacantMechanic = allMechanics.filter(mechanic => !mechanics.includes(mechanic))[0];
        const usedM = allMechanics.filter(mechanic => mechanics.includes(mechanic));
        // Update the Mechanic List
        // Update the time slot
        console.log(vacantMechanic);
        await updateDoc(doc(db, `${selectedDate}slots`, e.target.time.value), {
            count: parseInt(timeData.count) + 1,
            mechanics: [...usedM, vacantMechanic]
        });
        console.log('Updated Successfully');

        const endTime = parseInt(e.target.time.value.split('-')[1]);
        const endYear = selectedDate.substring(4, 8)
        const endMonth = selectedDate.substring(2, 4)
        const endDay = selectedDate.substring(0, 2)
        console.log(endTime, endYear, endMonth, endDay);
        const endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay), parseInt(endTime))
        console.log(endDate);
        // Add this to the collection of the day
        // console.log(serviceData)
        const data = {
            userId: service.userId,
            date: selectedDate,
            time: e.target.time.value,
            carNo: service.carNo,
            mechanicId: vacantMechanic,
            issues: service.issues,
            entry: true,
            exit: false,
            status: "Waiting for Service Manager",
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
            company: service.variant,
            model: service.model,
            email: service.email
        }
        const docDef = doc(collection(db, `${selectedDate}services`));
        // console.log(selectedDate, data, serviceData.userId)
        await setDoc(docDef, data);
        const q = query(collection(db, `${selectedDate}services`), where("mechanicId", "==", vacantMechanic), where("time", "==", e.target.time.value))
        const querySnapshot = await getDocs(q);
        let serviceIDD;
        querySnapshot.forEach(doc => {
            serviceIDD = doc.id;
        })
        // Service Id is registered in user collection
        const newwService = {
            serviceId: serviceIDD,
            collectionName: selectedDate,
            documentName: e.target.time.value,
            mechanicId: vacantMechanic,
            issues: service.issues,
            isDone: false,
            isStarted: false
        }
        const serviceDef = doc(collection(db, service.userId));
        await setDoc(serviceDef, newwService);
        await updateDoc(doc(db, `${dateTemp}services`, service.id), {
            reschedule: true,
            status: 'Rescheduled'
        });
        console.log('New Service is registered');
        setServiceError('')
        completeHandler();

    }

    const collideHandler = async (e) => {
        e.preventDefault()
        const timeSlot = e.target.time.value;
        const tempService = allServices.filter(service => service.time === e.target.time.value)[0]
        if (!tempService.carNo) {
            setCurrStage('result')
            return;
        }
        setService(tempService);
        if (tempService.managed) {
            setCurrStage('starting')
            setServiceError('Already Completed')
            return;
        }
        if (new Date(tempService.endDate.toDate()) < new Date()) {
            // if (new Date() <= new Date()) {

            setCurrStage('starting')
            const selectedDate = getCollName();
            // const selectedDate = '08112022services'
            // console.log(selectedDate);
            // console.log(tempService.id)
            await updateDoc(doc(db, selectedDate, tempService.id), {
                exceed: true
            });

            setServiceError('Time Limit Exceeds')
            return
        }
        if (!tempService.entry) {
            setCurrStage('starting')
            setServiceError('Entry is not Marked')
            return;
        }

        console.log(tempService);
        setServiceError('')
        setCurrStage('result');
    }

    return (
        <div className={classes.work}>
            <form onSubmit={submitHandler}>
                <input type="text" alt="Search" placeholder="Search Car No." value={carNo} onChange={e => setCarNo(e.target.value.toUpperCase())} />
                <button type="submit"><img src="/Manager/search.svg" alt="Search" /></button>
            </form>
            {loading && <div className={classes.error}>Loading...</div>}
            {serviceError && <div className={classes.error}>{serviceError}</div>}
            {serviceError === 'Time Limit Exceeds' && <div className={classes.error} style={{ color: 'red', border: '2px solid white', cursor: 'pointer', padding: '15px 20px' }} onClick={rescheduleHandler}>Wants to Reschedule</div>}
            {serviceError && <div className={classes.error} style={{ color: 'red', border: '2px solid white', cursor: 'pointer', padding: '15px 20px' }} onClick={completeHandler}>Cancel</div>}
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
                        <button className={classes.btn} onClick={clickHandler}>Continue</button>
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
                        <button className={classes.btn}>Complete</button>
                    </div>
                </form>
            </div>}
            {currStage === 'complete' && <div className={classes.result}>
                <h5 className={classes.finish}>
                    Service Details are Saved
                </h5>
                <div className={classes.details}>
                    {/* <h3 className={classes.heading}>Service Details</h3> */}
                    <div className={classes.detail}>
                        <h5>Car No</h5>
                        <h3>{service.carNo}</h3>
                    </div>
                    <div className={classes.detail}>
                        <h5>Time Slot</h5>
                        <h3>{service.time}</h3>
                    </div>
                    <div className={classes.ComBtns}>
                        <button className={classes.comBtn} onClick={completeHandler}>
                            Go back
                        </button>
                    </div>
                </div>
            </div>}
            {currStage === 'timeslot' && <div className={classes.result}>
                <form className={classes.detailsForm} onSubmit={timeHandler}>
                    <div className={classes.detailForm}>
                        <h5>Enter the Time Slot</h5>
                        <select name="time">
                            {times && times.map(time => (
                                <option key={time.value} value={time.value}>{time.value}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button className={classes.btn}>Complete</button>
                    </div>
                </form>
            </div>}
            {currStage === 'collide' && <div className={classes.result}>
                <form className={classes.detailsForm} onSubmit={collideHandler}>
                    <div className={classes.detailForm}>
                        <h5>Enter the Time Slot</h5>
                        <select name="time">
                            {collideSlots && collideSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className={classes.btn} type="submit">Complete</button>
                        <button className={classes.btn} onClick={completeHandler}>Go Back</button>
                    </div>
                </form>
            </div>}
        </div>
    );
}

export default WorkM;