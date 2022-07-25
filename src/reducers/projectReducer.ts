const projectReducer = (state=[], action) => {
    let payload = action.payload;
    switch(action.type) {
        case 'SET_ACTIVE' :
            return{
                ...state,
                activeProject : payload
            }
        case 'SET_PROJECTS' : 
            console.log(payload)
            return {
                ...state,
                projects : payload
            }
        default :
        return  state
    }
}

export default projectReducer;