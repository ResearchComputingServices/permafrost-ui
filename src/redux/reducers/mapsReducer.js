/**
 * Reducer for map settings
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import actionTypes from '../actions/actionTypes'

function mapsReducer(state = { mapsSettings: {} }, action) {
    switch(action.type) {
        case actionTypes.UPDATE_MAPS_SETTINGS:
            return Object.assign({}, state, {
                mapsSettings: action.mapsSettings
            });
        default:
            return state;
    }
}

export default mapsReducer
