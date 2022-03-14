import { useRSON } from "./useRSON";
import CountTester from "./CountTester";
import NotesTester from "./NotesTester";

const RSONTester = () => {

    let stateObject = useRSON({notesData: {notes: [1,2,3,4,5,6,7,8,9]}, 
                            counterData: {counter: {
                                count: 0,
                                increment: function() {
                                    console.log(this)
                                    this.count.$++
                                },
                                decrement: function() {
                                    console.log(this)
                                    this.count.$--
                                },
                            }}, 
                            test:0})

    console.log('Render Main')

    let {notesData, counterData} = stateObject
    return <div>
        <NotesTester notesStateObject={notesData}/>
        <CountTester counterStateObject={counterData}/>
        {/*<button onClick={() => stateObject.test++}>{stateObject.test}</button>}*/}
    </div>
}

export { RSONTester }