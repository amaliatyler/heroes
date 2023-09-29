import { configureStore } from '@reduxjs/toolkit';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

// функция автоматически будет принимать store
// и возвращать другую функцию, которая будет автоматически подхватывать dispatch
// а эта функция, в свою очередь, будет возвращать еще одну функцию
// которая, как аргумент, будет принимать в себя action
// который передается потом в dispatch

const stringMiddleware = (store) => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            // создаем объект вручную
            type: action,
        });
    }
    return next(action);
};

const store = configureStore({
    // сокращенная запись свойств объекта
    reducer: {heroes, filters},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production',

})


// два разных вида объявления объекта
// createStore принимает 2 аргумента, поэтому используем функцию compose, чтобы соединить много разных функций
// const store = createStore(
//                     combineReducers({ heroes: heroes, filters }),
//                     compose(applyMiddleware(ReduxThunk, stringMiddleware),
//                                             window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// );
export default store;
