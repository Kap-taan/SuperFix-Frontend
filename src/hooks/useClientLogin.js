import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext'

export const useClientLogin = () => {
    const { dispatch } = useAuthContext();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        setError('');

        // const response = await fetch('/api/auth/client/login', {
        const response = await fetch('https://superfix-api.onrender.com/api/auth/client/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
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
            console.log('I m here', json);
            dispatch({ type: 'LOGIN', payload: json })

            setLoading(false);

            setError('Thank you for logging')

        }

    }

    return { login, loading, error }

}