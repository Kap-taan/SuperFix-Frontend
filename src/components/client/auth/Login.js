import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClientLogin } from "../../../hooks/useClientLogin";
import classes from './Login.module.css';

const LoginClient = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, error, loading } = useClientLogin();


    const navigation = useNavigate();

    const submitHandler = async e => {
        e.preventDefault();
        // Authentication from Backend
        await login(email, password);
        if (error === 'Thank you for logging')
            navigation('/client/dashboard');
    }


    return (
        <div className={classes.login}>
            <div className={classes.login_one}>
                <img src="/client/back.jpg" alt="Login" />
            </div>
            <div className={classes.login_two}>
                <form onSubmit={submitHandler}>
                    <div className={classes.form_heading}>
                        <h3>Sign into Super <span style={{ color: '#20c9ff' }}>Fix</span></h3>
                        <p>as <span style={{ color: '#20c9ff' }}>client</span></p>
                    </div>
                    {error && <h5 className={classes.error}>{error}</h5>}
                    {loading && <h5 className={classes.error}>Loading...</h5>}
                    <div className={classes.form_body}>
                        <div className={classes.form_field}>
                            <input type="email" name="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} />
                            <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className={classes.form_btn}>
                            <button type="submit">Sign In</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginClient;