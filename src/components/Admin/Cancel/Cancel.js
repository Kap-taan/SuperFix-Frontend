import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from '../../../data/firebase';
import classes from './Cancel.module.css';

const getCollName = () => {
    const currDate = new Date();
    // Getting the collection Name
    const month = currDate.getMonth() + 1;
    const day = currDate.getDate();
    const year = currDate.getFullYear();
    return `${day}${month}${year}services`
}

const Cancel = () => {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const getData = async () => {
        setLoading(true);
        const collName = getCollName();
        const response = await getDocs(collection(db, collName))
        let tempServices = [];
        response.forEach(doc => {
            if (doc.data().status === 'Waiting for Vehicle') {
                tempServices = [...tempServices, {
                    ...doc.data(),
                    id: doc.id
                }]
            }
        })
        setServices(tempServices)
        setLoading(false);
    }

    useEffect(() => {
        getData()
    }, [])

    const cancelHandler = async (id) => {
        setCancelLoading(true);
        const selectedDate = getCollName();
        await updateDoc(doc(db, selectedDate, id), {
            exceed: true,
            status: 'Cancelled'
        });
        setCancelLoading(false);
        alert('Cancelled Successfully');
        setServices([]);
        getData();
    }

    return (
        <div className={classes.status}>
            <div className={classes.heading}>
                <h2>Admin Portal</h2>
                <p>Hello Anuj Kumar</p>
            </div>
            <div className={classes.section}>
                {!loading && services.length === 0 && <h4>No Services available</h4>}
                {loading && <h4 style={{ textAlign: 'center', fontSize: '1.3rem' }}>Loading...</h4>}
                <div className={classes.boxes}>
                    {services && services.map(service => (
                        <div className={classes.box}>
                            <h5>{service.carNo}</h5>
                            <img src="/admin/spare-parts.png" alt="Mechanic" />
                            <h2>{service.time}</h2>
                            <p>{service.mechanicId}</p>
                            <p>{service.status}</p>
                            {!cancelLoading && <button onClick={() => cancelHandler(service.id)}>Cancel</button>}
                            {cancelLoading && <h5 style={{ marginTop: '30px' }}>Loading...</h5>}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Cancel;