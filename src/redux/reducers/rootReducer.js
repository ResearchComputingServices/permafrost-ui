/**
 * Root Reducer that aggregates all the other reducers. This mechanism is called composition.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import { combineReducers } from 'redux'
import loggedInUserReducer from './loggedInUserReducer'
import mapsReducer from './mapsReducer'
import topNavigationReducer from './topNavigationReducer'

const rootReducer = combineReducers({
    maps: mapsReducer,
    loggedInUser: loggedInUserReducer,
    topNavigation: topNavigationReducer
})

export default rootReducer
