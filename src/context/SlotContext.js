import React from 'react';
import { createContext, useReducer } from 'react';

export const SlotContext = createContext();

export const slotReducer = (state, action) => {
    switch (action.type) {
        case 'DATE_SELECTED':
            return {
                ...state,
                date: action.payload
            }
        case 'TIME_SELECTED':
            return {
                ...state,
                time: action.payload
            }
        case 'MECHANIC_SELECTED':
            return {
                ...state,
                mechanic: action.payload
            }
        case 'ISSUES_SELECTED':
            return {
                ...state,
                issues: action.payload
            }
        case 'ID_SELECTED':
            return {
                ...state,
                serviceId: action.payload
            }
        case 'REMOVE':
            return {
                date: null,
                time: null,
                mechanic: null,
                issues: null,
                serviceId: null
            }
        default:
            return state
    }
}

export const SlotContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(slotReducer, {
        date: null,
        time: null,
        issues: null,
        mechanic: null,
        serviceId: null
    })

    return (
        <SlotContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SlotContext.Provider>
    )

}