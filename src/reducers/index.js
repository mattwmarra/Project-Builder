import taskReducer from './taskReducer'
import isLoggedInReducer from './isLoggedIn'
import {combineReducers} from 'redux'

const allReducer = combineReducers({
    taskReducer: taskReducer,
    isLogged : isLoggedInReducer
})

export default allReducer;