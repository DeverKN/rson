// 2 Things
// Immutable react state object
// "Mutable" RSON state object with get that gets values from the react state and set that replaces the immutable state

import { useState } from "react";
import { getNestedValue, updateImmutableObject, isObject, isFunction } from "./utils";

const objectWatcher = (path, interceptGet, interceptSet, terminal = true, bindMethods = false, autoRef = false) => {
	return {
		get: (obj, prop, reciever) => {
            const updatedPath = [...path, prop]
            let result = null
            if (isObject(result, true)) {
                //if (path.length > 0) {
                    //Not the end of the path
                    return new Proxy(result, objectWatcher(updatedPath, interceptGet, interceptSet, bindMethods, autoRef));
                /*} else {
                    //The end of the path
                    //return a *magic* object
                    const magicInterceptSet = (path, obj, prop, value) => {
                        if (prop === '$') {
                            console.log('magic set')
                            return interceptSet(path.slice(0, -1), obj, prop, value)
                        } else {
                            return interceptSet(path, obj, prop, value)
                        }
                    }
                    const magicInterceptGet = (path, obj, prop) => {
                        console.log({prop})
                        if (prop === '$') {
                            console.log('magic get')
                            return obj
                        } else {
                            //console.log({updatedPath, prop})
                            return interceptGet(path, obj, prop)
                        }
                    }
                    return new Proxy(result, objectWatcher(updatedPath, magicInterceptGet, magicInterceptSet, bindMethods, autoRef));
                }*/
			} else if (bindMethods && isFunction(result)) {
                return result.bind(reciever)
            } else {
                return autoRef ? Ref(() => interceptGet(updatedPath, obj, prop), value => interceptSet(updatedPath, obj, prop, value)) : result
            }
		},
		set: (obj, prop, value) => {
            const updatedPath = path = [...path, prop]
			return interceptSet(updatedPath, obj, prop, value);
		}
	}
}

/**
 * 
 * @param {*} rsonObject 
 * @returns {{refs: *}}
 */
const getRefs = (rsonObject) => {
    let refs = {}
    for (const key of Object.keys(rsonObject)) {
        refs[key] = getRef(rsonObject, key)
    }
    return refs
}

const getRef = (rsonObject, key) => {
    const value = rsonObject[key]
    if (isObject(value)) {
        return value
    } else if (isFunction(value))  {
        return value.bind(rsonObject)
    } else {
        let getCallback = () => {
            return rsonObject[key]
        }
        let setCallback = (newValue) => {
            rsonObject[key] = newValue
            return true
        }
        return Ref(getCallback, setCallback)
    }
}

const Ref = function(getCallback, setCallback) {
    return {
        get $() {
            return getCallback()
        },
        set $(newValue) {
            setCallback(newValue, this.value)
        },
        toString() {
          return this.value
        }
    }
}

const useRSON = (data, optimisticEvaluation = false) => {

    const [immutableReactState, setImmutableReactState] = useState(data)

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

    let proxiedRSON = new Proxy({}, objectWatcher([], interceptGet, interceptSet, false, true))

    return proxiedRSON
};

export { useRSON, getRefs, getRef }