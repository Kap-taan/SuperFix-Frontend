import React, { useEffect, useState } from "react";
import { useAuthContext } from '../../../hooks/useAuthContext';
import { db } from '../../../data/firebase';
import { doc, getDoc } from "firebase/firestore";
import classes from './Welcome.module.css';

const Welcome = () => {

    const [today, setDate] = useState(new Date());
    const locale = 'en';

    const [general, setGeneral] = useState('');
    const [expert, setExpert] = useState('');
    const [manager, setManager] = useState('');

    const [loading, setLoading] = useState(false);

    const { user } = useAuthContext();

    const [name, setName] = useState('');


    useEffect(() => {

        const timer = setInterval(() => { // Creates an interval which will update the current data every minute
            // This will trigger a rerender every component that uses the useDate hook.
            setDate(new Date());
        }, 60 * 1000);
        return () => {
            clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
        }
    }, [])

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user])

    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, { month: 'long' })}\n\n`;

    const hour = today.getHours();
    const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;

    const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });

    const generalHandler = async () => {

        setLoading(true);
        const response1 = await getDoc(doc(db, "contacts", "general"));
        setGeneral(response1.data().value);
        setLoading(false);

    }

    const expertHandler = async () => {

        setLoading(true);
        const response2 = await getDoc(doc(db, "contacts", "expert"));
        setExpert(response2.data().value);
        setLoading(false);

    }

    const managerHandler = async () => {

        setLoading(true);
        const response3 = await getDoc(doc(db, "contacts", "manager"));
        setManager(response3.data().value);
        setLoading(false);

    }

    return (
        <div className={classes.welcome}>
            <div className={classes.welcome_one}>
                <div className={classes.welcome_one_one}>
                    <h5>{wish} {name}</h5>
                </div>
                <div className={classes.welcome_one_two}>
                    <h2>{time}</h2>
                    <h5>{date}</h5>
                </div>
            </div>
            <div className={classes.welcome_two}>
                <h3>For Enquiry</h3>
                <ul>
                    <li onClick={generalHandler}>
                        {!general && <img src="/media/generalquery.svg" alt="Service" />}
                        <div>
                            <p>General Query</p>
                        </div>
                        {!general && !loading && <div className={classes.contact}><a>Contact</a></div>}
                        {general && <div className={classes.contact}>{general}</div>}
                        {!general && loading && <div className={classes.contact}>Loading...</div>}
                    </li>
                    <li onClick={managerHandler}>
                        {!manager && <img src="/media/manager.svg" alt="Service" />}
                        <div>
                            <p>Service Manager</p>
                        </div>
                        {!manager && !loading && <div className={classes.contact}><a>Contact</a></div>}
                        {manager && <div className={classes.contact}>{manager}</div>}
                        {!manager && loading && <div className={classes.contact}>Loading...</div>}
                    </li>
                    <li onClick={expertHandler}>
                        {!expert && <img src="/media/serviceexpert.svg" alt="Service" />}
                        <div>
                            <p>Technical Expert</p>
                        </div>
                        {!expert && !loading && <div className={classes.contact}><a>Contact</a></div>}
                        {expert && <div className={classes.contact}>{expert}</div>}
                        {!expert && loading && <div className={classes.contact}>Loading...</div>}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Welcome;