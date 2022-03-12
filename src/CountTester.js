const CountTester = (props) => {
    const {counterStateObject} = props
    let {counter} = counterStateObject
    return <>
        <button onClick={() => counter.decrement()}>-</button>
        {counter.count}
        <button onClick={() => counter.increment()}>+</button>
    </>
}

export { CountTester }