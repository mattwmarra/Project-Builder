const initialTaskState = {
    name : "",
    content : "",
    parent : ""
}

const taskReducer = (state = initialTaskState, action) => {
    switch(action.type){
        case 'NAME_CHANGED' : 
            return {...state, name: action.payload}
        case 'PARENT_CHANGED':
            return {...state, parent: action.payload}
        case 'FETCH':
            console.log("apl:" +    action.payload)
            return state
        default : 
            return state
    }
}

export default taskReducer