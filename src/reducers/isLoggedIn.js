const isLoggedInReducer = (state=false, action)=>{
    switch(action.type){
        case 'SIGN_IN':
            console.log(action.payload)
            return {
                ...state,
                isLogged : true,
                id : action.payload.id,
                projects : action.payload.projects
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