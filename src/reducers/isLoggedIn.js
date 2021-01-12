const isLoggedInReducer = (state=false, action)=>{
    switch(action.type){
        case 'SIGN_IN':
            return {
                ...state,
                isLogged : true
            }
        default:
            return state
    }
}

export default isLoggedInReducer