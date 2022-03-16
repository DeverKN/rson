import { useState } from "react"
import { isFunction, isObject } from "./utils"
import { updateImmutableObject, getNestedValue } from "./utils"

const symbolForTerminal = Symbol('terminal')

const computePath = (path, prop, terminal) => {
    let newPath = path.filter((x) => x !== '$')
    //return newPath.filter((x) => x !== '$')
    if (terminal() && (prop === '$')) {
        return newPath
    } else {
        return [...newPath, prop]
    }
}

const objectWatcherProxy = (path, getInterceptor, setInterceptor, terminal = () => false, unwrapPreviousCallback = () => {}) => {
    return {
        get: (obj, prop, reciever) => {
            if (prop === symbolForTerminal) {
                return terminal()
            }

            let toPrim = (typeof prop === 'symbol') && (prop.toString() === Symbol.toPrimitive.toString())
            const magicProp = (terminal() && (prop === '$'))
            let computedPath = computePath(path, prop, terminal)
            const result = getInterceptor(computedPath, obj, prop, reciever)

            if (toPrim) {
                console.log('toPrim')
                return result
            } else if (isFunction(result)) {
                //let magicFunc = (prop.charAt(0) === '$')
                //let wrappedFunction = result
                /*if (magicFunc) {
                    wrappedFunction = wrappedFunction.bind(reciever)
                } else {
                    wrappedFunction = wrappedFunction.bind(reciever.$)
                }*/
                return result.bind(reciever.$)//wrappedFunction
            } else if (magicProp) {
                return result
            } else {
                //Wrap in ref
                let shouldBeTerminal = true
                const terminalCallback = () => {
                    return shouldBeTerminal
                }
                const newUnwrapPreviousCallback = () => {
                    shouldBeTerminal = false
                }
                let terminalObj = new Proxy({}, objectWatcherProxy(computedPath, getInterceptor, setInterceptor, terminalCallback, newUnwrapPreviousCallback))
                unwrapPreviousCallback()
                return terminalObj
            }
        },
        set: (obj, prop, value, reciever) => {
            let computedPath = computePath(path, prop, terminal)
            return setInterceptor(computedPath, obj, prop, value, reciever)
        }
    }
}

const useRESON = (jsonData, optimisticEvaluation = false) => {
    const [immutableReactState, setImmutableReactState] = useState(jsonData)

    //setState() (or in this case setImmutableReactState()) is an async fuction
    //So if you do something like:
    //state = 0
    //setState(1)
    //setState(state + 1)
    //You will get a resulting state of 1 rather than 2
    //To get around this we use a local copy of the state that is updated before each
    //call to setState, this means we always have an up to date version of the state
    //to base future updates on
    let localState = immutableReactState
    //Additionally, if you use the 'optimisticEvaluation' flag then you can access these values rather than
    //the actual state, in general the two should be the same however there may be some cases where the local
    //version is more up to date than the stateful version

    const interceptGet = (path, obj, prop) => {
        if (optimisticEvaluation) {
            return getNestedValue(localState, path)
        } else {
            return getNestedValue(immutableReactState, path)
        }
    }

    const interceptSet = (path, obj, prop, value) => {
        localState = updateImmutableObject(localState, path, value)
        setImmutableReactState(localState)
        return true
    }

    return new Proxy ({}, objectWatcherProxy([], interceptGet, interceptSet, () => false))
}

export { useRESON, symbolForTerminal }