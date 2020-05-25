/**
 * User actions
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import actionTypes from './actionTypes'

export function updateLoggedInUser(payload) {
    return {
        type: actionTypes.UPDATE_LOGGED_IN_USER,
        loggedInUser: payload
    }
};
