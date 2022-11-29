import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from './Services.module.css';
import Navbar from "./Navbar";
import { db } from '../../../data/firebase'
import WelcomeSide from "./WelcomeSide";
import { collection, getDocs, query, where } from "firebase/firestore";

const MechanicServices = () => {

    const { id } = useParams();

    const [currStage, setCurrStage] = useState('info');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});

    const backBtnHandler = () => {
        console.log('Back button is pressed');
    }

    useEffect(() => {

        // window.addEventListener('beforeunload', this.handleWindowClose);

    }, [])

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Get the info
        console.log(`${date}services`, id);
        const q = query(collection(db, `${date}services`), where('mechanicId', '==', id));
        const response = await getDocs(q);
        let tempServices = [];
        response.forEach(doc => {
            tempServices = [...tempServices, {
                id: doc.id,
                carNo: doc.data().carNo,
                timeSlot: doc.data().time,
                issues: doc.data().issues,
                products: doc.data().mechanicProducts,
                status: doc.data().status
            }]
        })
        if (tempServices.length === 0) {
            setLoading(false);
            setError('Something went wrong');
            setCurrStage('error');
            return;
        }

        setServices(tempServices);
        console.log(tempServices);
        setLoading(false);
        setCurrStage('services');
    }

    const serviceHandler = (idx) => {
        setSelectedServices(services[idx]);
        setCurrStage('currentService')
    }

    const backHandler = () => {
        setCurrStage('info');
        setServices([]);
        setSelectedServices({});
    }

    return (
        <div className={classes.services}>
            <Navbar />
            <div className={classes.second}>
                <div className={classes.info}>
                    <div className={classes.details}>
                        <h2>List of Services</h2>
                        {currStage === 'error' && <h5>No Services Available</h5>}
                        {currStage === 'info' && <form classes={classes.detail} onSubmit={submitHandler}>
                            <div className={classes.item}>
                                <h4>Date (DDMMYYYY)</h4>
                                <input required type="text" value={date} onChange={e => setDate(e.target.value.trim())} />
                            </div>
                            <div className={classes.btns}>
                                {!loading && <button type="submit">Show Bill</button>}
                                {loading && <h4>Loading...</h4>}
                            </div>
                        </form>}
                        {currStage === 'services' && <div className={classes.list}>
                            {services && services.map((service, idx) => (
                                <div className={classes.item} onClick={() => serviceHandler(idx)}>
                                    <h4>{service.id}</h4>
                                    <h3>{service.timeSlot}</h3>
                                </div>
                            ))}
                            <div className={classes.btns}>
                                {!loading && <button onClick={backHandler}>Go Back</button>}
                                {loading && <h4>Loading...</h4>}
                            </div>

                        </div>}
                        {currStage === 'currentService' && <div className={classes.list}>
                            {selectedServices &&
                                <>
                                    <div className={classes.item}>
                                        <h4>Car No.</h4>
                                        <h3>{selectedServices.carNo}</h3>
                                    </div>
                                    <div className={classes.item}>
                                        <h4>Time Slot</h4>
                                        <h3>{selectedServices.timeSlot}</h3>
                                    </div>
                                    <div className={classes.item}>
                                        <h4>Issues</h4>
                                        {selectedServices.issues && selectedServices.issues.map(issue => (
                                            <h3 key={issue}>{issue}</h3>
                                        ))}
                                    </div>
                                    <div className={classes.item}>
                                        <h4>Products Replaced</h4>
                                        {selectedServices.products && selectedServices.products.map(product => (
                                            <h3 key={product.name}>{product.name} ({product.quantity})</h3>
                                        ))}
                                    </div>
                                    <div className={classes.item}>
                                        <h4>Status</h4>
                                        <h3>{selectedServices.status}</h3>
                                    </div>
                                </>}
                            <div className={classes.btns}>
                                {!loading && <button onClick={backHandler}>Go Back</button>}
                                {loading && <h4>Loading...</h4>}
                            </div>
                        </div>}
                    </div>
                    {error && <h5 className="loading">{error}</h5>}
                </div>
                <WelcomeSide />
            </div>
        </div>

    );
}

export default MechanicServices;