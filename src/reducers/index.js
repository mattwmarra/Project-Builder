import taskReducer from './taskReducer'
import isLoggedInReducer from './isLoggedIn'
import {combineReducers} from 'redux'
import projectReducer from './projectReducer';

export const allReducer = combineReducers({
    project: taskReducer,
    //we have all the projects listed, then we have the active project. 
    //we get the tasks from the active project
    projects: projectReducer,
    isLogged : isLoggedInReducer
})

export default allReducer;