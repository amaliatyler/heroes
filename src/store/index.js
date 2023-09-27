import { legacy_createStore as createStore, combineReducers } from 'redux';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

// два разных вида объявления объекта
const store = createStore(combineReducers({ heroes: heroes, filters }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;