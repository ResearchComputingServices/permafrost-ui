/**
 * Reducer for logged in user
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import actionTypes from '../actions/actionTypes'

function loggedInUserReducer(state = { loggedInUser: {} }, action) {
    switch(action.type) {
        case actionTypes.UPDATE_LOGGED_IN_USER:
            return Object.assign({}, state, {
                loggedInUser: action.loggedInUser
            });
        default:
            return state;
    }
}

export default loggedInUserReducer
