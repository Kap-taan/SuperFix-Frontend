import React, { useState } from 'react';
import classes from './AddEmployee.module.css';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../data/firebase';
import emailjs from 'emailjs-com'
import AdminFooter from '../Footer/Footer';

const AddEmployee = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const sendEmail = (employeeId, employeePassword, type) => {
        emailjs.send('service_sar8k95', 'template_uncahzg', { email, type, subject: 'Your Login Credentials', employeeId, password: employeePassword, name }, 'gOg_hi3ORrq1QmKIr').then(result => {
            console.log(result.text);
        }).catch(err => console.log(err))
    }

    const addEmployeeToBackend = async (id, type) => {
        const employeeId = email.split('@')[0];
        const employeePassword = id.slice(7, 15);
        const response = await fetch('/api/auth/employee/signup', {
            method: 'POST',
            body: JSON.stringify({ employeeId, email, password: employeePassword, type, firebaseId: id }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        const json = await response.json();
        if (!response.ok) {
            setError(json.error);
            console.log(json.error);
            await deleteDoc(doc(db, type, id));
            console.log(`Delete the ${type} in firebase successfully`);
        }
        if (response.ok) {
            sendEmail(employeeId, employeePassword, type);
        }
        return response;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const type = e.target.type.value;
        const data = { name, email, age, phone, address, type, available: true };

        addDoc(collection(db, type), data).then(docRef => {
            console.log(`New ${type} in Firebase is created successfully`);
            return addEmployeeToBackend(docRef.id, type)
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`New ${type} in MongoDB is created Successfully`);
                    setName('');
                    setEmail('');
                    setAge('');
                    setPhone('');
                    setAddress('');
                    setLoading(false);
                    console.log('New Employee created successfully');
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })

    }

    return (
        <>
            <div className={classes.addemployee}>
                <div className={classes.addemployee_first}>
                    <div className={classes.heading}>
                        <h3>Add Employee</h3>
                        <p>Important Assets</p>
                    </div>
                    <div className={classes.btn}>
                        <button>Log out</button>
                    </div>
                </div>
                <div className={classes.main_logo}>
                    <h2>Employee Details</h2>
                    {loading && <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Loading...</h4>}
                    <form onSubmit={submitHandler}>
                        <div className={classes.single_field}>
                            <label>Name</label>
                            <input required type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className={classes.single_field}>
                            <label>Email</label>
                            <input required type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className={classes.single_field}>
                            <label>Age</label>
                            <input required type="number" name="age" value={age} onChange={e => setAge(e.target.value)} />
                        </div>
                        <div className={classes.single_field}>
                            <label>Phone No</label>
                            <input required type="text" name="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div className={classes.single_field}>
                            <label>Address</label>
                            <input required type="text" name="address" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                        <div className={classes.single_field}>
                            <label>Type of Employee</label>
                            <select name='type' required>
                                <option value="mechanic">Mechanic</option>
                                <option value="manager">Service Manager</option>
                                <option value="accountant">Accountant</option>
                                <option value="guard">Guard</option>
                                <option value="storemanager">Store Manager</option>
                            </select>
                        </div>
                        <button type='submit'>Add Employee</button>
                    </form>
                </div>
            </div>
            <AdminFooter />
        </>
    );
}

export default AddEmployee;