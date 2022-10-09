import { SlotContext } from "../context/SlotContext"
import { useContext } from "react"

export const useSlotContext = () => {
    const context = useContext(SlotContext)

    if (!context) {
        throw Error('useSlotContext must be used inside an SlotContextProvider')
    }

    return context
}