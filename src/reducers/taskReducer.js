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
            console.log(action.payload)
            return {...state, parent: action.payload}
        case 'FETCH':
            return action.payload
        default : 
            return state
    }
}

export default taskReducer