import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext'

export const useEmployeeLogin = () => {
    const { dispatch } = useAuthContext();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const login = async (employeeId, password) => {
        setLoading(true);
        setError('');

        const response = await fetch('/api/auth/employee/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId, password })
        })

        const json = await response.json();

        if (!response.ok) {
            setLoading(false);
            setError(json.error);
        }

        if (response.ok) {
            // save the user to the local storage
            localStorage.setItem('user', JSON.stringify(json));

            // update the global state of user / auth context
            dispatch({ type: 'LOGIN', payload: json })

            setLoading(false);

        }

    }

    return { login, loading, error }

}