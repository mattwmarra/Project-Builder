const isLoggedInReducer = (state=false, action)=>{
    switch(action.type){
        case 'SIGN_IN':
            return {
                ...state,
                isLogged : true,
                // user : {
                //     name : action.payload.name,
                //     email : action.payload.email,
                // },
                // projects : action.payload.projects
            }
        default:
            return state
    }
}

export default isLoggedInReducer