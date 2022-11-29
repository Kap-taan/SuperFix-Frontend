import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../data/firebase';
import classes from './Employees.module.css'

const Employees = () => {

    const [mechanics, setMechanics] = useState([]);
    const [spareParts, setSpareParts] = useState([]);
    const [managers, setManagers] = useState([]);
    const [guards, setGuards] = useState([]);
    const [accountants, setAccountants] = useState([]);

    // Loading states
    const [loadingMechanic, setLoadingMechanic] = useState(false);
    const [loadingSpareParts, setLoadingSpareParts] = useState(false);
    const [loadingManagers, setLoadingManagers] = useState(false);
    const [loadingGuards, setLoadingGuards] = useState(false);
    const [loadingAccountants, setLoadingAccountants] = useState(false);

    const getData = async () => {
        // Getting the Data
        setLoadingAccountants(true);
        setLoadingGuards(true);
        setLoadingManagers(true);
        setLoadingMechanic(true);
        setLoadingSpareParts(true);
        const mechanic = await getDocs(collection(db, 'mechanic'))
        let tempMechanics = [];
        mechanic.forEach(doc => {
            tempMechanics = [...tempMechanics, {
                id: doc.id,
                email: doc.data().email,
                name: doc.data().name,
                phone: doc.data().phone,
                address: doc.data().address
            }]
        })
        console.log(tempMechanics);
        setMechanics(tempMechanics);
        setLoadingMechanic(false);

        const manager = await getDocs(collection(db, 'manager'))
        let tempManagers = [];
        manager.forEach(doc => {
            tempManagers = [...tempManagers, {
                id: doc.id,
                email: doc.data().email,
                name: doc.data().name,
                phone: doc.data().phone,
                address: doc.data().address
            }]
        })
        console.log(tempManagers);
        setManagers(tempManagers);
        setLoadingManagers(false);

        const guard = await getDocs(collection(db, 'guard'))
        let tempGuards = [];
        guard.forEach(doc => {
            tempGuards = [...tempGuards, {
                id: doc.id,
                email: doc.data().email,
                name: doc.data().name,
                phone: doc.data().phone,
                address: doc.data().address
            }]
        })
        console.log(tempGuards);
        setGuards(tempGuards);
        setLoadingGuards(false);

        const accountant = await getDocs(collection(db, 'accountant'))
        let tempAccountants = [];
        accountant.forEach(doc => {
            tempAccountants = [...tempAccountants, {
                id: doc.id,
                email: doc.data().email,
                name: doc.data().name,
                phone: doc.data().phone,
                address: doc.data().address
            }]
        })
        console.log(tempAccountants);
        setAccountants(tempAccountants);
        setLoadingAccountants(false);

        const sparePart = await getDocs(collection(db, 'storemanager'))
        let tempSpareParts = [];
        sparePart.forEach(doc => {
            tempSpareParts = [...tempSpareParts, {
                id: doc.id,
                email: doc.data().email,
                name: doc.data().name,
                phone: doc.data().phone,
                address: doc.data().address
            }]
        })
        console.log(tempSpareParts);
        setSpareParts(tempSpareParts);
        setLoadingSpareParts(false);


    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className={classes.employees}>
            <h3>Employees</h3>
            <div className={classes.section}>
                <h4>Mechanics</h4>
                {loadingMechanic && <h4 style={{ textAlign: 'center', fontSize: '1.3rem' }}>Loading...</h4>}
                <div className={classes.boxes}>
                    {mechanics && mechanics.map(mechanic => (
                        <div className={classes.box}>
                            <h5>{mechanic.id}</h5>
                            <img src="/admin/mechanic.png" alt="Mechanic" />
                            <h4>{mechanic.email}</h4>
                            <h2>{mechanic.name}</h2>
                            <p>{mechanic.address}</p>
                        </div>
                    ))}

                </div>
            </div>
            <div className={classes.section}>
                <h4>Service Managers</h4>
                {loadingManagers && <h4 style={{ textAlign: 'center', fontSize: '1.3rem' }}>Loading...</h4>}
                {/* {loadingManagers && <h5>Loading...</h5>} */}
                <div className={classes.boxes}>
                    {managers && managers.map(manager => (
                        <div className={classes.box}>
                            <h5>{manager.id}</h5>
                            <img src="/admin/manager.png" alt="Mechanic" />
                            <h4>{manager.email}</h4>
                            <h2>{manager.name}</h2>
                            <p>{manager.address}</p>
                        </div>
                    ))}

                </div>
            </div>
            <div className={classes.section}>
                <h4>Guards</h4>
                {loadingGuards && <h4 style={{ textAlign: 'center', fontSize: '1.3rem' }}>Loading...</h4>}
                <div className={classes.boxes}>
                    {guards && guards.map(guard => (
                        <div className={classes.box}>
                            <h5>{guard.id}</h5>
                            <img src="/admin/guard.png" alt="Mechanic" />
                            <h4>{guard.email}</h4>
                            <h2>{guard.name}</h2>
                            <p>{guard.address}</p>
                        </div>
                    ))}

                </div>
            </div>
            <div className={classes.section}>
                <h4>Accountant</h4>
                {loadingAccountants && <h4 style={{ textAlign: 'center', fontSize: '1.3rem' }}>Loading...</h4>}
                <div className={classes.boxes}>
                    {accountants && accountants.map(accountant => (
                        <div className={classes.box}>
                            <h5>{accountant.id}</h5>
                            <img src="/admin/budget.png" alt="Mechanic" />
                            <h4>{accountant.email}</h4>
                            <h2>{accountant.name}</h2>
                            <p>{accountant.address}</p>
                        </div>
                    ))}

                </div>
            </div>
            <div className={classes.section}>
                <h4>Spare Parts Managers</h4>
                {loadingSpareParts && <h4 style={{ textAlign: 'center', fontSize: '1.3rem' }}>Loading...</h4>}
                <div className={classes.boxes}>
                    {spareParts && spareParts.map(sparePart => (
                        <div className={classes.box}>
                            <h5>{sparePart.id}</h5>
                            <img src="/admin/spare-parts.png" alt="Mechanic" />
                            <h4>{sparePart.email}</h4>
                            <h2>{sparePart.name}</h2>
                            <p>{sparePart.address}</p>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Employees;