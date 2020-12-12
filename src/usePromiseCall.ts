import { useCallback, useEffect, useMemo, useState } from "react";

type RT<DataType> = [boolean, DataType | null, any] & {
    result: DataType | null,
    loading: boolean,
    error: any
}

/**
 * 
 * @param call returning Promise function or async function
 * @param args dependencies/arguments for call function
 * @param stopWhile while this arg is true, the function will not be called(optional)
 * @returns mix of array and object like [loading, result, error] & {
 *  loading,
 *  result,
 *  error
 * }
 * @description useing for async function calls; can be used in 2 different ways.
 * 
 * @example
 * //first way
 * const App = () => {
 * 
 *  const [loading, data] = usePromise(() => new Promise(resolve => {
 *      setTimeout(resolve, 2000) 
 *  }))
 * 
 *  return (
 *      <div>
 *          {loading ? "LOADING" : "LOADED"}
 *          {data ?? "NOT_LOADED"}
 *      </div>
 *  )
 * }
 * //second way
 * const toCall = (num) => Promise.resolve(num)
 * const App = () => {
 *  
 *  const { loading, result } = usePromise(toCall, 222)
 * 
 *  return (
 *      <div>
 *          {loading ? "LOADING" : "LOADED"}
 *          {result ?? "NOT_LOADED"}
 *      </div>
 *  )
 * }
 */
export const usePromiseCall = <Result, ArgsType extends any[] = any[]>(
    call: (...args: ArgsType) => Promise<Result>,
    args: ArgsType,
    stopWhile?: boolean
): RT<Result> => {
    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const caller = useCallback(call, args)

    useEffect(() => {
        if(stopWhile) return
        let mounted = true;

        setLoading(true)

        caller(...args)
            .then(res => {
                if(!mounted) return
                setResult(res)
            })
            .catch(e => {
                if(!mounted) return
                setError(e)
            })
            .finally(() => {
                if(!mounted) return
                setLoading(false)
            })

        return () => {
            mounted = false;
        }
    }, [caller, stopWhile, ...args])

    const toReturn = useMemo<RT<Result>>(() => {
        return Object.assign(
            [loading, result, error] as [boolean, Result | null, any],
            {
                result,
                loading,
                error
            }
        )
    }, [result, loading, error])

    return toReturn
}