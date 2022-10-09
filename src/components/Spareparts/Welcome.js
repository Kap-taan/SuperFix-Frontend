import React, { useEffect, useState } from "react";
import classes from './Welcome.module.css';

const Welcome = () => {

    const [today, setDate] = useState(new Date());
    const locale = 'en';


    useEffect(() => {
        const timer = setInterval(() => { // Creates an interval which will update the current data every minute
            // This will trigger a rerender every component that uses the useDate hook.
            setDate(new Date());
        }, 60 * 1000);
        return () => {
            clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
        }
    }, [])

    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, { month: 'long' })}\n\n`;

    const hour = today.getHours();
    const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;

    const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });


    return (
        <div className={classes.welcome}>
            <div className={classes.welcome_one}>
                <div className={classes.welcome_one_one}>
                    <h5>{wish} Anuj Kumar</h5>
                </div>
                <div className={classes.welcome_one_two}>
                    <h2>{time}</h2>
                    <h5>{date}</h5>
                </div>
            </div>
            <div className={classes.welcome_two}>
                <h3>For Enquiry</h3>
                <ul>
                    <li>
                        <img src="/media/generalquery.svg" alt="Service" />
                        <div>
                            <p>General Query</p>
                        </div>
                        <div className={classes.contact}><a>Contact</a></div>
                    </li>
                    <li>
                        <img src="/media/manager.svg" alt="Service" />
                        <div>
                            <p>Service Manager</p>
                        </div>
                        <div className={classes.contact}><a>Contact</a></div>
                    </li>
                    <li>
                        <img src="/media/serviceexpert.svg" alt="Service" />
                        <div>
                            <p>Technical Expert</p>
                        </div>
                        <div className={classes.contact}><a>Contact</a></div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Welcome;