import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../data/firebase'
import classes from './Status.module.css'

const getCollName = () => {
    const currDate = new Date();
    // Getting the collection Name
    const month = currDate.getMonth() + 1;
    const day = currDate.getDate();
    const year = currDate.getFullYear();
    return `${day}${month}${year}services`
}

const Status = () => {

    const [currStage, setCurrStage] = useState('info');
    const [date, setDate] = useState('');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const collName = getCollName();
        // Getting the data
    }, [])

    const submitHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        const collName = `${date}services`;
        const q = query(collection(db, collName), orderBy('endDate'))
        const response = await getDocs(q)
        let tempServices = [];
        response.forEach(doc => {
            tempServices = [...tempServices, doc.data()]
        })
        setServices(tempServices);
        console.log(tempServices);
        setLoading(false);
        setCurrStage('details')
    }

    const backHandler = () => {
        setDate('')
        setCurrStage('info')
    }

    return (
        <div className={classes.status}>
            <div className={classes.heading}>
                <div>
                    <h2>Admin Portal</h2>
                    <p>Hello Anuj Kumar</p>
                </div>

                {currStage === 'details' && <div>
                    <button onClick={backHandler}>Go Back</button>
                </div>}
            </div>
            {currStage === 'info' && <form onSubmit={submitHandler}>
                <h3>Status of the day</h3>
                <div className={classes.input_field}>
                    <label>Enter the Date(DDMMYYYY)</label>
                    <input required type="text" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className={classes.input_field}>
                    {!loading && <button type='submit'>Show</button>}
                    {loading && <h5>Loading...</h5>}
                </div>
            </form>}
            {currStage === 'details' && <div className={classes.section}>
                <h4>{`${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4, 8)}`}</h4>
                {/* {loadingSpareParts && <h4 style={{ textAlign: 'center', fontSize: '1.3rem' }}>Loading...</h4>} */}
                <div className={classes.boxes}>
                    {services && services.map(service => (
                        <div className={classes.box}>
                            <h5>{service.carNo}</h5>
                            <img src="/admin/spare-parts.png" alt="Mechanic" />
                            <h4>{service.company}</h4>
                            <h2>{service.time}</h2>
                            <p>{service.mechanicId}</p>
                            <p>{service.status}</p>
                            <h2>&#8377; {service.total}</h2>
                        </div>
                    ))}

                </div>
            </div>}
            {currStage === 'details' && services.length === 0 && <h3 style={{ textAlign: 'center' }}>No services :(</h3>}
        </div>
    )
}

export default Status;