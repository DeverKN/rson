import React from "react"
import {symbolForTerminal} from "./useRESON"

const CountTester = (props) => {
    let {counterStateObject} = props
    let {counter} = counterStateObject
    //console.log({counter})
    let {increment, decrement, count} = counter
    /*console.log({counter, counter$: counter.$})
    console.log({increment, decrement, count})
    console.log("Check if counter terminal")
    console.log(`symbolForTerminal : ${symbolForTerminal.toString()}`)*/
    //console.log({count})
    //console.log({$:count.$})
    //console.log({counter_count: counter.count.$})*/
    return <>
        <button onClick={() => counter.decrement()}>-</button>
        {count.$}
        <button onClick={() => counter.increment()}>+</button>
    </>
}

export default CountTester