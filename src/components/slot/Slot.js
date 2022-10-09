import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../data/firebase';
import { useSlotContext } from '../../hooks/useSlotContext';
import { useAuthContext } from '../../hooks/useAuthContext';


const Slot = () => {

    const [dates, setDates] = useState([]);
    const [times, setTimes] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const { user } = useAuthContext();

    const [uid, setUid] = useState('');
    const [carNo, setCarNo] = useState('');
    const [name, setName] = useState('');

    const { date, time, dispatch } = useSlotContext();

    // Time slots and Operational Units Pre Fetch
    let timeSlots = ["10-11", "11-12", "1-2", "2-3", "3-4", "4-5"];
    let operationalUnits = 3;

    // user id
    const [mechanic, setMechanic] = useState('');

    // Information about the mechanics
    const [usedMechanics, setUsedMechanics] = useState([]);
    const [allMechanics, setAllMechanics] = useState([]);

    const [currStage, setCurrStage] = useState('date');

    useEffect(() => {
        // Making the next 7 days
        let tomorrow = new Date();
        let tempDates = [];
        // tempDates = [...tempDates, tomorrow.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })]
        for (let i = 0; i < 7; i++) {
            tomorrow.setDate(tomorrow.getDate() + 1);
            tempDates = [...tempDates, tomorrow.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })]
        }
        setDates(tempDates);
        // Getting all the mechanics
        getDocs(collection(db, "mechanic")).then(docs => {
            let tempMechanics = [];
            docs.forEach(doc => {
                tempMechanics = [...tempMechanics, doc.id]
            })
            setAllMechanics(tempMechanics);
        })
        // Getting the Previous Selected date
        const prevDate = localStorage.getItem(`Date${uid}`)
        if (prevDate) {
            setSelectedDate(prevDate);
            const prevTime = localStorage.getItem(`Time${uid}`)
            setSelectedTime(prevTime)
            setCurrStage('issues');
        }



    }, [])

    useEffect(() => {
        // Setting up the user
        if (user) {
            setUid(user._id)
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
                let usedMechanicsTemp = []
                docs.forEach(doc => {
                    console.log(doc.id, doc.data().count);
                    if (!(doc.data().count >= operationalUnits)) {
                        timesTemp = [...timesTemp, { value: doc.id, count: doc.data().count }];
                        usedMechanicsTemp = [...usedMechanicsTemp, {
                            slot: doc.id,
                            mechanics: doc.data().mechanics
                        }]
                    }
                })
                setTimes(timesTemp);
                setUsedMechanics(usedMechanicsTemp);
            }
        }).catch(err => {
            console.log(err);
        })
        setSelectedDate(dateTemp);
        setCurrStage('time')
        dispatch({ type: 'DATE_SELECTED', payload: dateTemp })
        localStorage.setItem(`Date${uid}`, dateTemp);
    }

    const timeHander = async (e) => {
        e.preventDefault();
        const timeData = times.filter(time => time.value === e.target.time.value)[0];
        // Incrementing the no of count of that day and timing
        console.log(timeData);
        // Finding the mechanic
        let mechanics;
        if (usedMechanics.length > 0) {
            mechanics = usedMechanics.filter(slot => slot.slot === timeData.value)[0].mechanics;
        } else {
            mechanics = []
        }
        const vacantMechanic = allMechanics.filter(mechanic => !mechanics.includes(mechanic))[0];
        const usedM = allMechanics.filter(mechanic => mechanics.includes(mechanic));
        setMechanic(vacantMechanic);
        // Update the Mechanic List
        // Update the time slot
        console.log(selectedDate);
        console.log(e.target.time.value);
        console.log(vacantMechanic);
        console.log(allMechanics);
        await updateDoc(doc(db, `${selectedDate}slots`, e.target.time.value), {
            count: parseInt(timeData.count) + 1,
            mechanics: [...usedM, vacantMechanic]
        });
        console.log('Updated Successfully');
        setCurrStage('issues');
        setSelectedTime(e.target.time.value);
        dispatch({ type: 'TIME_SELECTED', payload: e.target.time.value })
        localStorage.setItem(`Time${uid}`, time);
    }

    const issueHandler = async (e) => {
        e.preventDefault();
        const issues = e.target.issues.value.split(',');
        console.log(issues);
        // Add this to the collection of the day
        const data = {
            userId: uid,
            date: selectedDate,
            time: selectedTime,
            carNo: carNo,
            mechanicId: mechanic,
            issues,
            entry: false,
            exit: false,
            status: "Waiting for Vehicle"
        }
        const docDef = doc(collection(db, `${selectedDate}services`));
        await setDoc(docDef, data);
        console.log('New Service is registered');
        dispatch({ type: 'REMOVE' })
        localStorage.removeItem(`Date${uid}`);
        localStorage.removeItem(`Time${uid}`);
    }

    return (
        <div>
            {currStage === 'date' && <form onSubmit={dateHandler}>
                <select name='date'>
                    {dates && dates.map(date => (
                        <option key={date}>{date}</option>
                    ))}
                </select>
                <button>Next</button>
            </form>}
            {currStage === 'time' && <form onSubmit={timeHander}>
                <select name='time'>
                    {times[0] && times.map(time => (
                        <option key={time.value} value={time.value}>{time.value}</option>
                    ))}
                </select>
                <button>Next</button>
            </form>}
            {currStage === 'issues' && <form onSubmit={issueHandler}>
                <input type="text" name="issues" placeholder='Issues (Separated by commas)' />
                <button type='submit'>Next</button>
            </form>}
        </div>
    )
}

export default Slot;