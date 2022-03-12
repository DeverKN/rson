// 2 Things
// Immutable react state object
// "Mutable" RSON state object with get that gets values from the react state and set that replaces the immutable state

import { useState } from "react";
import { getNestedValue, updateImmutableObject, isObject } from "./Utilities";

const objectWatcher = (path, interceptGet, interceptSet) => {
	return {
		get: (obj, prop) => {
            const updatedPath = [...path, prop]
            let result = interceptGet(updatedPath, obj, prop)
            console.log({path, obj, prop});
            console.log({result});
            console.log('get intercepted');
            if (isObject(result, true)) {
				return new Proxy(result, objectWatcher(updatedPath, interceptGet, interceptSet));
			} else {
                return result
            }
		},
		set: (obj, prop, value) => {
            const updatedPath = path = [...path, prop]
            console.log({path: JSON.stringify(path), obj: JSON.stringify(obj), prop: JSON.stringify(prop), value: JSON.stringify(value)});
            console.log('set intercepted');
			return interceptSet(updatedPath, obj, prop, value);
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

    const interceptSet = async (path, obj, prop, value) => {
        localState = updateImmutableObject(localState, path, value)
        console.log({data})
        setImmutableReactState(localState)
        return true
    }

    let proxiedRSON = new Proxy({}, objectWatcher([], interceptGet, interceptSet))

    return proxiedRSON
};

export { useRSON }