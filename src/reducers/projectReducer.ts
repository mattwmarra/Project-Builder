const projectReducer = (state=[], action) => {
    let payload = action.payload;
    switch(action.type) {
        case 'SET_ACTIVE' :
            return{
                ...state,
                activeProject : payload
            }
        case 'SET_PROJECTS' : 
            const projects = Object.entries(payload);
            return projects;
        default :
        return  state
    }
}

export default projectReducer;