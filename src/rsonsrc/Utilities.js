/**
 * Checks if the given value is an object (or an object or array is the 'includeArray' flag is used)
 * @param {*} val The value to to check
 * @param {Boolean} includeArray (Disabled by default), if this is enabled then arrays will return true
 * rather than false
 * @returns {{isObject: Boolean}} true if the input is an object, otherwise false
 */
const isObject = (val, includeArray = false) => {
    return (val !== null) && (typeof(val) === 'object') && (includeArray || !Array.isArray(val))
}

/**
 * Updates a value in an immutable object. Doesn't mutate the object but instead returns
 * a new object with the specified value changed
 * @param {Object} immutableObject The object to update
 * @param {Array<String>} pathArr An array representing the path to the value to change, 
 * in the form ["test1","test2"] where ["test1","test2"] = nestedObj.test1.test2
 * @param {*} newValue The new value to use
 * @returns {{newObject: Object}} A new object, identical to the original but with the specified value changed
 */
 const updateImmutableObject = (immutableObject, pathArr, newValue) => {
    const pathKey = pathArr.shift()
    //If the path hasn't terminated, then call updateImmutableObject recursively with the rest of the path
    const shouldCallRecursively = (pathArr.length > 0)
    //Can't use normal object spread syntax with an array (it turns in into a normal object)
    if (Array.isArray(immutableObject)) {
        //Instead copy the array and then change the value
        if (shouldCallRecursively) {
            let newImmutable = [...immutableObject]
            newImmutable[pathKey] = updateImmutableObject(immutableObject[pathKey], pathArr, newValue)
            return newImmutable
        } else {
            let newImmutable = [...immutableObject]
            newImmutable[pathKey] = newValue
            return newImmutable
        }
    } else {
        if (shouldCallRecursively) {
            return {...immutableObject, [pathKey]: updateImmutableObject(immutableObject[pathKey], pathArr, newValue)}
        } else {
            return {...immutableObject, [pathKey]: newValue}
        }
    }
}

/**
 * Returns a value nested in an object using the path specific
 * @param {Object} nestedObj - The object to get a value from
 * @param {Array<String>} pathArr - An array representing the path to the value, in the form ["test1","test2"]
 * where ["test1","test2"] = nestedObj.test1.test2
 * @param {Boolean} optionalChaining - (Enabled by default), if this is enabled then optional chaining is used
 * for property access (ie. ?. instead of .) Prevents errors if one of the intermediary proprties doesn't exist
 * @returns {{value: *}} The requested value
 */
const getNestedValue = (nestedObj, pathArr, optionalChaining = true) => {
    console.log(pathArr)
    if (pathArr.length === 0) return nestedObj
    return pathArr.reduce((obj, key) => {
        if (optionalChaining) {
            return obj?.[key]
        } else {
            return obj[key]
        }
    }, nestedObj)
}

export { isObject, updateImmutableObject, getNestedValue }
