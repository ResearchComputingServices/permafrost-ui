/**
 * Top navigation actions
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import actionTypes from './actionTypes'

export function updateTopNavigation(payload) {
    return {
        type: actionTypes.UPDATE_TOP_NAVIGATION,
        topNavigation: payload
    }
};
