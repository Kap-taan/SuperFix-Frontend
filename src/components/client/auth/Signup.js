import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import classes from './Signup.module.css';

const SignupClient = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [carNo, setCarNo] = useState('');
    const [model, setModel] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');

    const [currStage, setCurrStage] = useState('first');


    const navigation = useNavigate();

    const { dispatch } = useAuthContext();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Authentication from Backend
        console.log(e.target.variant.value);
        const response = await fetch('/api/auth/client/signup', {
            // const response = await fetch('https://superfix-api.onrender.com/api/auth/client/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone, address, carNo, company, model, variant: e.target.variant.value })
        })
        const json = await response.json();
        if (!response.ok) {
            console.log(json.error);
            setError(json.error);
            setLoading(false);
        }
        if (response.ok) {
            setLoading(false);
            localStorage.setItem('user', JSON.stringify(json))
            // update the auth context
            dispatch({ type: 'LOGIN', payload: json })
            navigation('/client/dashboard');
        }
    }

    const nextHandler = () => {
        setCurrStage('second');
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
                    {error && <h5 className={classes.error}>{error}</h5>}
                    {loading && <h5 className={classes.error}>Loading...</h5>}
                    <div className={classes.form_body}>
                        {currStage === 'first' && <div className={classes.form_field}>
                            <input type="email" name="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} />
                            <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            <input type="text" name="name" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                            <input type="text" name="carNo" placeholder="Car No" value={carNo} onChange={e => setCarNo(e.target.value)} />
                            <input type="text" name="address" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                            <input type="text" name="phone" placeholder="Phone No" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>}
                        {currStage === 'second' && <div className={classes.form_field}>
                            <input type="text" name="company" placeholder="Brand" value={company} onChange={e => setCompany(e.target.value)} />
                            <input type="text" name="model" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} />
                            <select name="variant">
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                            </select>
                        </div>}
                        {currStage === 'second' && <div className={classes.form_btn}>
                            <button type="submit">Sign Up</button>
                        </div>}
                    </div>
                </form>
                {currStage === 'first' && <div className={classes.form_btn}>
                    <button onClick={nextHandler}>Next</button>
                </div>}
            </div>
        </div>
    );
}

export default SignupClient;