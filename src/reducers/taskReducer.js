const initialTaskState = {  }

const taskReducer = (state = initialTaskState, action) => {
    switch(action.type){
        case 'NAME_CHANGED' : 
            return {...state, name: action.payload}
        case 'PARENT_CHANGED':
            console.log(action.payload)
            console.log({state})
            return {
                ...state, 
                columns : {
                    ...state.columns,
                    [action.payload.payload.parent] : {
                        ...state.columns[action.payload.payload.parent]
                    }
                }
            }
        case 'FETCH':
            return {
                ...state,
                columns : action.payload
            }
        default : 
            return state
    }
}

export default taskReducer