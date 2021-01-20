
const initialTaskState = {
    _id : 65465465,
    name : "Uh Oh!",
    columns : [
        {
            _id : 654684514,
            title : "Retrieving your board...",
            tasks : [
                {
                    _id : 69696969,
                    title : "or we messed something up...",
                }
            ]
        }
    ]
 }

const taskReducer = (state = initialTaskState, action) => {
    let payload = action.payload;
    switch(action.type){
        case 'ADD_TASK' : 
            console.log(payload)
            return {
                ...state,
                columns : {
                    ...state.columns,
                    [payload._id] : {
                        ...state.columns[payload._id],
                        tasks : payload.columnItems
                    }
                }
            }
        case 'NAME_CHANGED' : 
            console.log(action.payload, state)
            return {
                ...state, 
                columns : {
                    ...state.columns,
                    [action.payload.parent] : {
                        ...state.columns[action.payload.parent],
                        [action.payload._id] : action.payload
                    }
                }

            }
        case 'PARENT_CHANGED':
            payload = action.payload;
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
        case 'PRIORITY_CHANGED' : 
            console.log(action.payload)
            return {
                ...state,
                columns : {
                    ...state.columns,
                    [action.payload.parent] : {
                        ...state.columns[action.payload.parent],
                        [action.payload._id] : {
                            ...action.payload,
                            priority : action.payload.priority
                        }
                    }
                }
            }
        case 'FETCH':
            return {
                isLogged : state.isLogged,
                columns : action.payload
            }
        default : 
            return state
    }
}

export default taskReducer