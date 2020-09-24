const initialTaskState = {
    name : "",
    content : "",

}

const taskReducer = (state = initialTaskState, action) => {
    switch(action.type){
        case 'RENAME' : 
            console.log(state)
            return
     default : 
        return state
    }
}

export default taskReducer