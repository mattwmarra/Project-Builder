const authReducer = (state=false, action: any)=>{
    switch(action.type){
        case 'SIGN_IN':
            console.log(action.payload)
            return {
                isLoggedIn : true,
                id : action.payload._id,
                name: action.payload.name,
                email: action.payload.email
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

export default authReducer