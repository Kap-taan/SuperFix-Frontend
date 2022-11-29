import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeLogin } from '../../../hooks/useEmployeeLogin'
import classes from './Login.module.css';


const LoginEmployee = () => {

    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');

    const { login, error, loading } = useEmployeeLogin();

    const navigation = useNavigate();


    const submitHandler = async e => {
        e.preventDefault();
        // Authentication from Backend
        await login(employeeId, password);
        if (error === 'Thank you for logging')
            navigation('/employee/dashboard');
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
                        <p>as <span style={{ color: '#20c9ff' }}>employee</span></p>
                    </div>
                    {error && <h5 className={classes.error}>{error}</h5>}
                    {loading && <h5 className={classes.error}>Loading...</h5>}
                    <div className={classes.form_body}>
                        <div className={classes.form_field}>
                            <input type="text" name="employeeId" placeholder='Employee Id' value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
                            <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className={classes.form_btn}>
                            <button type="submit">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        // <>
        //     <form onSubmit={submitHandler}>
        //         <input type="text" name="employeeId" placeholder='Employee Id' value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
        //         <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
        //         <button type="submit">Login</button>
        //         {error && <div>{error}</div>}
        //     </form>
        // </>
    );
}

export default LoginEmployee;