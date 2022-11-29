import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useClientSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()


    const signup = async (email, password, name, address, phone, carNo, variant, company, model) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/auth/client/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, address, phone, carNo, company, model, variant })
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json })

            // update loading state
            setIsLoading(false)
        }
    }

    return { signup, isLoading, error }
}