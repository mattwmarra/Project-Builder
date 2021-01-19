import taskReducer from './taskReducer'
import isLoggedInReducer from './isLoggedIn'
import {combineReducers} from 'redux'

export const allReducer = combineReducers({
    project: taskReducer,
    isLogged : isLoggedInReducer
})

export default allReducer;