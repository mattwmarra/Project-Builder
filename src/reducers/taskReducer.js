
const initialTaskState = {
    _id : 65465465,
    name : "Uh Oh!",
    columns : [
        {
            _id : 654684514,
            title : "Connection to the server failed",
            tasks : [
                {
                    _id : 69696969,
                    title : "or we're just loading....",
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
            return {...state, name: action.payload}
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