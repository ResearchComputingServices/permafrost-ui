/**
 * Maps actions
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import actionTypes from './actionTypes'

export function updateMapsSettings(payload) {
    return {
        type: actionTypes.UPDATE_MAPS_SETTINGS,
        mapsSettings: payload
    }
};
