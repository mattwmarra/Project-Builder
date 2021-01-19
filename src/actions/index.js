export const signInAction = () => {
    return{
        type: 'SIGN_IN'
    }
}
export const renameTask = (payload) => {
    return {
        type: "NAME_CHANGED",
        payload: payload.title
    }
}

export const fetchTasks = (payload) => {
    return {
        type: 'FETCH',
        payload
    }
}

export const changeParent = (payload) => {
    return{
        type: 'PARENT_CHANGED',
        payload
    }
}

export const addTask = (payload) => {
    return {
        type: "ADD_TASK",
        payload
    }
}