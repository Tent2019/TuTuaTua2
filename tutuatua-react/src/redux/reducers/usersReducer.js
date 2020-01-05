import { ADD_USER } from "../actions/actions";

export default function usersReducer(users=[], action) {
    switch(action.type){
        case ADD_USER: 
            return [...users, {
                id: action.id,
                username: action.username,
                password: action.password,
                usertypes: action.usertypes
            }]
        default: 
            return users
    }
}