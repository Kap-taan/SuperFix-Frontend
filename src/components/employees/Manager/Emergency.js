import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../../../data/firebase';
import classes from './Emergency.module.css';
import { useNavigate } from 'react-router-dom'

const getCollName = () => {
    const currDate = new Date();
    // Getting the collection Name
    const month = currDate.getMonth() + 1;
    const day = currDate.getDate();
    const year = currDate.getFullYear();
    return `${day}${month}${year}`
}

const Emergency = () => {

    const navigate = useNavigate();

    const [userId, setUserId] = useState('');
    const [carNo, setCarNo] = useState('');
    const [company, setCompany] = useState('');
    const [model, setModel] = useState('');
    const [variant, setVariant] = useState('');
    const [issues, setIssues] = useState('');
    const [mechanicId, setMechanicId] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('')
        setLoading(true);
        // Getting the end date
        const date = new Date();
        const currHour = date.getHours() + 1;
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const endDate = new Date(year, month, day, currHour)

        const time = `${currHour - 1}-${currHour}`;

        const newService = {
            carNo,
            company,
            complete: false,
            date: getCollName(),
            endDate,
            entry: true,
            exceed: false,
            exit: false,
            isStarted: false,
            managed: false,
            status: 'Meet the Service manager',
            time,
            issues: issues.split(','),
            mechanicId,
            mechanicProducts: [],
            model,
            paid: false,
            reschedule: false,
            spareParts: [],
            total: 0,
            userId,
            variant
        }

        // Add this doc
        const docRef = await addDoc(collection(db, `${getCollName()}services`), newService)
        if (docRef.id) {

        }
        else {
            setError('Not successful');
            setLoading(false);
            return;
        }

        console.log(docRef.id);

        // Adding it to the user
        const newwService = {
            collectionName: getCollName(),
            documentName: time,
            mechanicId,
            issues: issues.split(','),
            isDone: false,
            isStarted: false,
            endDate: endDate,
            serviceId: docRef.id
        }

        console.log(newwService)

        const docRef1 = await addDoc(collection(db, userId), newwService)
        if (docRef1.id) {
            alert("New service is added")
            navigate('/employee/dashboard');

        } else {
            setError('Not successful')
            await updateDoc(doc(db, `${getCollName}services`, docRef.id), {
                exceed: true,
                status: 'Cancelled'
            });
            setLoading(false);
            return;
        }


        setUserId('');
        setCarNo('');
        setCompany('');
        setModel('');
        setVariant('');
        setIssues('');
        setIssues('');
        setMechanicId('');

    }

    return (
        <div className={classes.info}>
            <div className={classes.details}>
                <h2>Add an Emergency Slot</h2>
                <form onSubmit={submitHandler}>
                    <div className={classes.item}>
                        <h4>User Id</h4>
                        <input type="text" value={userId} onChange={e => setUserId(e.target.value)} />
                    </div>
                    <div className={classes.item}>
                        <h4>Mechanic Id</h4>
                        <input type="text" value={mechanicId} onChange={e => setMechanicId(e.target.value)} />
                    </div>
                    <div className={classes.item}>
                        <h4>Car No.</h4>
                        <input type="text" value={carNo} onChange={e => setCarNo(e.target.value.toLocaleUpperCase())} />
                    </div>
                    <div className={classes.item}>
                        <h4>Company</h4>
                        <input type="text" value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    <div className={classes.item}>
                        <h4>Model</h4>
                        <input type="text" value={model} onChange={e => setModel(e.target.value)} />
                    </div>
                    <div className={classes.item}>
                        <h4>Variant</h4>
                        <input type="text" value={variant} onChange={e => setVariant(e.target.value)} />
                    </div>
                    <div className={classes.item}>
                        <h4>Issues</h4>
                        <input type="text" placeholder='Separated by commas' value={issues} onChange={e => setIssues(e.target.value)} />
                    </div>
                    <div className={classes.btns}>
                        {!loading && <button type="submit">Add Slot</button>}
                        {loading && <h4>Loading...</h4>}
                        {error && <h4>{error}</h4>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Emergency;