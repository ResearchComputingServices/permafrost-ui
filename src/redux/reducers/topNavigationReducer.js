/**
 * Reducer for top navigation
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import actionTypes from '../actions/actionTypes'

function topNavigationReducer(state = { topNavigation: {} }, action) {
    switch(action.type) {
        case actionTypes.UPDATE_TOP_NAVIGATION:
            return Object.assign({}, state, {
                topNavigation: action.topNavigation
            });
        default:
            return state;
    }
}

export default topNavigationReducer
