export const ADD_USER = 'ADD_USER';

export function addUser(username, password, usertypes) {
    return {
        type: ADD_USER,
        id: Math.round(Math.random()*1000),
        username: username,
        password: password,
        usertypes: usertypes
    }    
}



