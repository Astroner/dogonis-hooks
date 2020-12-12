import { useCallback, useMemo, useState } from "react"

type RT = [boolean, VoidFunction, VoidFunction, VoidFunction] & {
    state: boolean
    setTrue: VoidFunction
    setFalse: VoidFunction
    toggle: VoidFunction
}

export const useBooleanState = (initialState?: boolean): RT => {
    const [state, setState] = useState(initialState ?? false);

    const setTrue = useCallback(() => {
        setState(true)
    }, [])

    const setFalse = useCallback(() => {
        setState(false)
    }, [])

    const toggle = useCallback(() => {
        setState(p => !p)
    }, []) 

    const result = useMemo<RT>(() => {
        return Object.assign(
            [state, setTrue, setFalse, toggle] as [boolean, VoidFunction, VoidFunction, VoidFunction],
            {
                state,
                setTrue,
                setFalse,
                toggle
            }
        )
    }, [state])

    return result
}