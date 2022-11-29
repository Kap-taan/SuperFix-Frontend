import { async } from '@firebase/util';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../../data/firebase';
import classes from './OperationalUnits.module.css';

const OperationalUnits = () => {

    const [loading, setLoading] = useState(false);

    const [value, setValue] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateDoc(doc(db, "basicinfo", "admin"), {
            operationalUnits: parseInt(value)
        })
        setLoading(false);
        setValue('')
    }

    return (
        <div className={classes.status}>
            <div className={classes.heading}>
                <div>
                    <h2>Admin Portal</h2>
                    <p>Hello Anuj Kumar</p>
                </div>

                {/* <div>
                    <button onClick={backHandler}>Go Back</button>
                </div> */}
            </div>
            <form onSubmit={submitHandler}>
                <h3>Status of the day</h3>
                <div className={classes.input_field}>
                    <label>Update the Slots</label>
                    <input required type="number" value={value} onChange={e => setValue(e.target.value)} />
                </div>
                <div className={classes.input_field}>
                    {!loading && <button type='submit'>Change</button>}
                    {loading && <h5>Loading...</h5>}
                </div>
            </form>
        </div>
    )
}

export default OperationalUnits