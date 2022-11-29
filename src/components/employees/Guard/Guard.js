import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from '../../../data/firebase';
import NavbarG from './Navbar';
import Welcome from '../../client/Dashboard/Welcome';
import classes from './Guard.module.css';

const Guard = () => {


    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(false);

    const entryHandler = (id, time) => {
        console.log(id);
        const collectionName = `${new Date().toLocaleDateString().substring(0, 2)}${new Date().toLocaleDateString().substring(3, 5)}${new Date().toLocaleDateString().substring(6, 10)}`;
        // const collectionName = '08112022'
        if (time !== 'Offline') {
            updateDoc(doc(db, `${collectionName}services`, id), {
                entry: true,
                status: "Meet the Service Manager"
            })
        }
        else {
            updateDoc(doc(db, `${collectionName}services`, id), {
                entry: true,
                status: "Waiting for Mechanic"
            })
        }
        alert('Entry is marked successfully')
        getInfo(collectionName);
    }

    const getInfo = async (collectionName) => {


        setLoading(true);

        const docsSnap = await getDocs(collection(db, `${collectionName}services`));
        let servicesTemp = [];
        docsSnap.forEach(doc => {
            if (doc.data().entry === false) {
                servicesTemp = [...servicesTemp, {
                    carNo: doc.data().carNo,
                    time: doc.data().time,
                    entry: doc.data().entry,
                    id: doc.id
                }]
            }

        })

        setServices(servicesTemp);

        console.log(servicesTemp);


        setLoading(false);

    }

    useEffect(() => {
        const collectionName = `${new Date().toLocaleDateString().substring(0, 2)}${new Date().toLocaleDateString().substring(3, 5)}${new Date().toLocaleDateString().substring(6, 10)}`;
        // const collectionName = '08112022';
        getInfo(collectionName);
    }, [])

    return (
        <div className={classes.dashboard}>
            <NavbarG />
            <div className={classes.infos}>
                <div className={classes.quote}>
                    <h3>Dashboard</h3>
                </div>
                <div className={classes.info}>
                    <div className={classes.services}>
                        {loading && <div className={classes.loading}>Loading...</div>}
                        {!loading && services.length > 0 && <table className={classes.contentTable}>
                            <thead>
                                <tr>
                                    <th>Car No.</th>
                                    <th>Slot</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(service => (
                                    <tr key={service.id}>
                                        <td>{service.carNo}</td>
                                        <td>{service.time}</td>
                                        <td>
                                            {!service.entry && <img onClick={() => entryHandler(service.id, service.time)} src="/Guard/entry.svg" alt="Entry" />}
                                            {service.entry && <img src="/Guard/exit.svg" alt="Delete" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>}
                        {!loading && !services.length && <div className={classes.noService}><h5>No more Services registered for this day</h5></div>}
                    </div>
                    <Welcome />
                </div>
            </div>
        </div>
    )
}

export default Guard;