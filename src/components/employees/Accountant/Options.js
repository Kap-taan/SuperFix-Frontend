import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../../data/firebase';
import classes from './Options.module.css';
import { getDoc, doc, updateDoc } from "firebase/firestore";

const Options = () => {

    const { user } = useAuthContext();

    // States
    const [currStage, setCurrStage] = useState('intro')
    const [serviceId, setServiceId] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        setLoading(true);
        setError('')
        e.preventDefault();
        console.log(date)
        const response = await getDoc(doc(db, `${date}services`, serviceId))
        if (!response.exists()) {
            setLoading(false);
            setError('Service not Found');
            return;
        }

        if (response.data().reschedule) {
            setLoading(false);
            setError('Service is Rescheduled');
            return;
        }

        if (response.data().paid) {
            setLoading('')
            setError('Bill is already paid')
            return;
        }
        if (!response.data().complete) {
            setError('Service is yet to be finished');
            setLoading(false);
            return
        }
        let tempTotalAmount = 0;
        let money = response.data().spareParts;
        money.map(item => {
            tempTotalAmount += item.totalPrice;
        })
        // setTotalAmount(tempTotalAmount);


        // Getting the price from options
        const options = response.data().options;

        if (options.type === 'basic') {
            tempTotalAmount += 1000
        } else {
            tempTotalAmount += 2000
        }

        if (options.washing === 'yes') {
            tempTotalAmount += 500
        }

        if (options.polish === 'yes') {
            tempTotalAmount += 500
        }

        if (options.dryClean === 'yes') {
            tempTotalAmount += 500
        }

        setTotalAmount(tempTotalAmount);

        // Update the totalAmount and paid -> true
        await updateDoc(doc(db, `${date}services`, serviceId), {
            total: tempTotalAmount
        })

        setService(response.data())
        setCurrStage('end')
        setLoading(false)

        console.log(response.data())

    }

    const paidHandler = async () => {
        setLoading(true);
        await updateDoc(doc(db, `${date}services`, serviceId), {
            paid: true,
            status: "Paid"
        })
        alert('Paid Successfully')
        setServiceId('')
        setDate('');
        setCurrStage('intro')
        setLoading(false);
    }

    return (
        <>
            {currStage === 'intro' && <div className={classes.info}>
                <div className={classes.details}>
                    <h2>Bill</h2>
                    <form classes={classes.detail} onSubmit={submitHandler}>
                        <div className={classes.item}>
                            <h4>Service Id</h4>
                            <input required type="text" value={serviceId} onChange={e => setServiceId(e.target.value.trim())} />
                        </div>
                        <div className={classes.item}>
                            <h4>Date (DDMMYYYY)</h4>
                            <input required type="text" value={date} onChange={e => setDate(e.target.value.trim())} />
                        </div>
                        <div className={classes.btns}>
                            {!loading && <button type="submit">Show Bill</button>}
                            {loading && <h4>Loading...</h4>}
                        </div>
                    </form>
                </div>
                {error && <h5 className="loading">{error}</h5>}
            </div>}
            {currStage === 'end' && service.carNo && <div className={classes.info}>
                <div className={classes.details}>
                    <h2>Bill</h2>
                    <div className={classes.detail}>
                        <div className={classes.item}>
                            <h5>Date</h5>
                            <h3>{date}</h3>
                        </div>
                        <div className={classes.item}>
                            <h5>Time</h5>
                            <h3>{service.time}</h3>
                        </div>
                        <div className={classes.item}>
                            <h5>Car No.</h5>
                            <h3>{service.carNo}</h3>
                        </div>
                        <div className={classes.item}>
                            <h5>Products by Mechanic</h5>
                            {service.mechanicProducts && service.mechanicProducts.map(product => {
                                return (
                                    <>
                                        <h3>{product.name} -{product.quantity}</h3>
                                    </>
                                )
                            })}
                        </div>
                        <div className={classes.item}>
                            <h5>Products by Spare Parts Manager</h5>
                            {service.spareParts && service.spareParts.map(product => {
                                return (
                                    <>
                                        <h3>{product.name} - {product.quantity} - {product.price} - {product.totalPrice}</h3>
                                    </>
                                )
                            })}
                        </div>
                        <div className={classes.item}>
                            <h5>Options Chosen</h5>
                            <h3>Type: {service.options.type}</h3>
                            <h3>Washing: {service.options.washing}</h3>
                            <h3>Polish: {service.options.polish}</h3>
                            <h3>Dry Clean: {service.options.dryClean}</h3>
                        </div>
                        <div className={classes.item}>
                            <h5>Total Amount</h5>
                            <h3>{totalAmount}</h3>
                        </div>
                        <div className={classes.btns}>
                            {!loading && <button onClick={paidHandler}>Paid</button>}
                            {loading && <h4>Loading...</h4>}
                        </div>
                    </div>
                </div>
            </div>}
            {!service && <h5>No Service Found</h5>}
        </>
    );
}

export default Options;