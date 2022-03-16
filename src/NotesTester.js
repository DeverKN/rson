import React from "react"
const NotesTester = (props) => {
    let {notesStateObject} = props
    let {notes} = notesStateObject
    console.log('Render Notes')
    console.log({notes})
    console.log({push: notes.push})
    return <>
        <button onClick={() => {
            console.log("start click")
            notes.push(1)
            console.log("end click")
        }}>Add Note</button>
        Num Notes: {notes.length.$}
        <button onClick={() => {
            notes.pop()
        }}>Remove Note</button>
        <button onClick={() => notes.$ = []}>Clear Notes</button>
    </>
}

export default NotesTester