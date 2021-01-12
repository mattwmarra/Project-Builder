const initialTaskState = {  }

const taskReducer = (state = initialTaskState, action) => {
    switch(action.type){
        case 'NAME_CHANGED' : 
            return {...state, name: action.payload}
        case 'PARENT_CHANGED':
            let payload = action.payload;
            return {
                ...state,
                columns : {
                    ...state.columns,
                    [payload.source.droppableId] : {
                        ...payload.sourceColumn,
                        tasks: payload.sourceItems
                    },
                    [payload.destination.droppableId] : {
                        ...payload.destColumn,
                        tasks : payload.destItems
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