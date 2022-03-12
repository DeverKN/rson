const NotesTester = (props) => {
    let {notesStateObject} = props
    let {notes} = notesStateObject
    console.log({notes})
    return <>
        <button onClick={() => {
            console.log("start click")
            notesStateObject.notes.push(1)
            console.log("end click")
        }}>Add Note</button>
        Num Notes: {notes.length}
        <button onClick={() => {
            notesStateObject.notes.pop()
        }}>Remove Note</button>
        <button onClick={() => notesStateObject.notes = []}>Clear Notes</button>
    </>
}

export { NotesTester }