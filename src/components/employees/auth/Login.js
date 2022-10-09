import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeLogin } from '../../../hooks/useEmployeeLogin'


const LoginEmployee = () => {

    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');

    const { login, error, loading } = useEmployeeLogin();

    const navigation = useNavigate();


    const submitHandler = async e => {
        e.preventDefault();
        // Authentication from Backend
        await login(employeeId, password);
        navigation('/employee/dashboard');
    }

    return (
        <>
            <form onSubmit={submitHandler}>
                <input type="text" name="employeeId" placeholder='Employee Id' value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
                <input type="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                {error && <div>{error}</div>}
            </form>
        </>
    );
}

export default LoginEmployee;