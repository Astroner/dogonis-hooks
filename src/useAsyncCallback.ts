import { useCallback, useState, useEffect, useMemo } from 'react'

type hookState = {
    isMounted: () => boolean
    cancel: VoidFunction
}

type RT<Args extends any[], ValueType> = [
    (...args: Args) => void,
    boolean,
    ValueType | null,
    any | null
] & {
    call: (...args: Args) => void
    loading: boolean
    result: ValueType | null
    error: any | null
}

/**
 *
 * @param fn function to memoize
 * @param deps dependencies for fn
 * @param disableObservation disables loading/result/error changes
 *
 * @description asynchronous analogue for useCallback. u can check component mount state using first argument in fn with isMounted method(render optimization)
 */

export const useAsyncCallback = <Args extends any[], ReturnType = void>(
    fn: (state: hookState, ...args: Args) => Promise<ReturnType>,
    deps?: any[],
    disableObservation?: boolean
): RT<Args, ReturnType> => {
    const [args, setArgs] = useState<Args | null>(null)

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ReturnType | null>(null)
    const [error, setError] = useState<any>(null)

    const memFn = useCallback(fn, deps ?? [])

    const call = useCallback((...args: Args) => {
        setArgs(args)
    }, [])

    useEffect(() => {
        if (!args) return
        let mounted = true

        let state: hookState | null = {
            isMounted: () => mounted,
            cancel: () => {
                mounted = false
            },
        }

        if(!disableObservation) {
            setLoading(true)
            setError(false)
        }
        memFn(state, ...args)
            .then((res) => {
                if (!mounted || disableObservation) return
                setResult(res)
            })
            .catch((err) => {
                if (!mounted || disableObservation) return
                setError(err)
            })
            .finally(() => {
                if (!mounted || disableObservation) return
                state = null
                setLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [args, memFn, disableObservation])

    const rt = useMemo<RT<Args, ReturnType>>(() => {
        return Object.assign(
            [call, loading, result, error] as [
                (...args: Args) => void,
                boolean,
                ReturnType | null,
                any | null
            ],
            {
                call,
                loading,
                result,
                error,
            }
        )
    }, [call, loading, result, error])

    return rt
}
