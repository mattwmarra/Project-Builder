
const initialTaskState = {
    _id : 65465465,
    name : "bogus",
    columns : [
        {
            _id : 654684514,
            title : "djkhasd",
            tasks : [
                {
                    _id : 69696969,
                    title : "",
                }
            ]
        }
    ]
 }

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
            console.log(action.payload)
            return {
                ...state,
                columns : action.payload
            }
        default : 
            return state
    }
}

export default taskReducer