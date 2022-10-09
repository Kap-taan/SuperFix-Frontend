import { useAuthContext } from '../hooks/useAuthContext';

export const useEmployeeLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = () => {
        localStorage.removeItem('user')

        dispatch({ type: 'LOGOUT' });
    }

    return { logout };

}