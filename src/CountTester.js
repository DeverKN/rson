import {getRefs} from "./useRSON"
import React from "react"

const CountTester = (props) => {
    let {counterStateObject} = props
    let {counter} = counterStateObject
    let {increment, decrement, count} = counter
    /*console.log({increment, decrement})
    console.log({count})
    console.log({$:count.$})
    console.log({counter_count: counter.count.$})*/
    return <>
        <button onClick={() => decrement()}>-</button>
        {count.$}
        <button onClick={() => increment()}>+</button>
    </>
}

export default CountTester