export const signInAction = (payload) => {
    return{
        type: 'SIGN_IN',
        payload
    }
}
export const renameTask = (payload) => {
    return {
        type: "NAME_CHANGED",
        payload: payload
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

export const changePriority = (payload) => {
    console.log(payload)
    return {
        type: "PRIORITY_CHANGED",
        payload
    }
}