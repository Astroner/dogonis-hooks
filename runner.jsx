import 'regenerator-runtime/runtime'
import { render } from "react-dom";
import React from 'react'
import { useAsyncCallback, useBooleanState, useClass, usePromiseCall } from "./src";

const delay = (n) => new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    }, n);
})

const App = () => {

    const root = useClass(
        "root",
        false,
        null,
        0,
        "Kek"
    )

   /*  const { result } = usePromiseCall(
        () => new Promise(resolve => {
            setTimeout(() => {
                resolve({ id: 2 })
            }, 2000);
        }), 
        []
    )

    const [, data] = usePromiseCall(async () => {
        await delay(2000)
        return "@@@@"
    }, [], !result) */

    const { call, result } = useAsyncCallback(async (state) => {
        await delay(1000);
        if(!state.isMounted()) return false
        return true
    }, [])

    return (
        <div onClick={call} className={root}>
            {/* {result ? `RES: ${result.id}` : "LOADING"}
            <br />
            {data ?? "LOADING"}
            <br /> */}
            {result ? "FINISHED" : "NOT_FINISHED"}
        </div>
    )
}

render(<App />, document.getElementById("root"))