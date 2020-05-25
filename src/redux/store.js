/**
 * Redux has only one store, this is the one. (Flux can have multiple stores)
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import { createStore } from 'redux'
import rootReducer from './reducers/rootReducer'

// Create the store and pass the rootReducer as argument, which aggregates all the specific reducers.
var store = createStore(rootReducer);

// Make it visible in the entire application.
export default store;
