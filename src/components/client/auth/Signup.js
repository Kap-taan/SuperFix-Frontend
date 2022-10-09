import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import classes from './Signup.module.css';

const SignupClient = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [carNo, setCarNo] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');


    const navigation = useNavigate();

    const { dispatch } = useAuthContext();

    const submitHandler = async e => {
        e.preventDefault();
        // Authentication from Backend
        const response = await fetch('/api/auth/client/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone, address, carNo })
        })
        const json = await response.json();
        if (!response.ok) {
            console.log(json.error);
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json))
            // update the auth context
            dispatch({ type: 'LOGIN', payload: json })
            navigation('/client/dashboard');
        }
    }

    return (
        <div className={classes.login}>
            <div className={classes.login_one}>
                <img src="/media/service1.jpg" alt="Login" />
            </div>
            <div className={classes.login_two}>
                <form onSubmit={submitHandler}>
                    <div className={classes.form_heading}>
                        <h3>Sign up into Super <span style={{ color: '#20c9ff' }}>Fix</span></h3>
                        <p>Or <span style={{ color: '#20c9ff' }}>Sign</span> Up</p>
                    </div>
                    <div className={classes.form_body}>
                        <div className={classes.form_field}>
                            <input type="email" name="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} />
                            <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            <input type="text" name="name" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                            <input type="text" name="carNo" placeholder="Car No" value={carNo} onChange={e => setCarNo(e.target.value)} />
                            <input type="text" name="address" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                            <input type="text" name="phone" placeholder="Phone No" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div className={classes.form_btn}>
                            <button type="submit">Sign Up</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupClient;