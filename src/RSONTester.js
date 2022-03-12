import { useRSON } from "./rsonsrc/useRSON";
import { CountTester } from "./CountTester";
import { NotesTester } from "./NotesTester";

const RSONTester = () => {

    let stateObject = useRSON({notesData: {notes: [1,2,3,4,5,6,7,8,9]}, 
                            counterData: {counter: {
                                count: 0,
                                increment: function() {
                                    console.log(this)
                                    this.count++
                                },
                                decrement: function() {
                                    console.log(this)
                                    this.count--
                                },
                            }}, 
                            test:0})

    /*console.log({stuff: stateObject.test})

    let test = stateObject.notesData
    console.log({test: test})
    let test2 = test.notesData
    console.log({test2: test2})
    console.log({test4: stateObject.counterData.count.count})
    console.log({test5: getNestedValue(stateObject, ['notesData', 'notesData'])})
    const {counterData} = newStateObject
    console.log({test7: newStateObject})
    console.log({test6: counterData})
    let test3 = test2.notes
    console.log({test3: test3})*/

    let {notesData, counterData} = stateObject
    return <div>
        <NotesTester notesStateObject={notesData}/>
        <CountTester counterStateObject={counterData}/>
        <button onClick={() => stateObject.test++}>{stateObject.test}</button>
    </div>
}

export { RSONTester }