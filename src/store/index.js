import { legacy_createStore as createStore, combineReducers, compose } from 'redux';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

const enhancer = (createStore) => (...args) => {

    const store = createStore(...args);

    // сохраняем предыдущий диспэтч
    const oldDispatch = store.dispatch;
    // создаем новый диспэтч
    store.dispatch = (action) => {
        // если тип экшена - строка (не объект)
        if(typeof action === 'string') {
            return oldDispatch({
                // создаем объект вручную
                type: action
            })
        }
        return oldDispatch(action)
    }
    return store;
}

// два разных вида объявления объекта
// createStore принимает 2 аргумента, поэтому используем функцию compose, чтобы соединить много разных функций
const store = createStore(
                combineReducers({ heroes: heroes, filters }), 
                compose(
                    enhancer,
                    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    ));
export default store;