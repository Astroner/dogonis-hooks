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

    const [, data] = usePromiseCall(async () => {
        await delay(2000)
        return 20
    }, true)

    return (
        <div  className={root}>
            {data}
        </div>
    )
}

render(<App />, document.getElementById("root"))