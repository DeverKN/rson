import { useRESON, symbolForTerminal } from "./useRESON";
import CountTester from "./CountTester";
import NotesTester from "./NotesTester";

const RSONTester = () => {

    let stateObject = useRESON({notesData: {notes: [1,2,3,4,5,6,7,8,9]}, 
                            counterData: {counter: {
                                count: 0,
                                increment: function() {
                                    this.count++
                                },
                                decrement: function() {
                                    this.count--
                                },
                            }},
                            test:0})

    console.log('Render Main')

    let {notesData, counterData} = stateObject
    //console.log({stateObject})
    //console.log({counterData})
    return <div>
        <NotesTester notesStateObject={notesData}/>
        <CountTester counterStateObject={counterData}/>
        {/*<button onClick={() => stateObject.test++}>{stateObject.test}</button>}*/}
    </div>
}

export { RSONTester }