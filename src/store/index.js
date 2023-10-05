import { configureStore } from '@reduxjs/toolkit';
import filters from '../components/heroesFilters/filtersSlice';
import { apiSlice } from '../api/apiSlice';

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
    reducer: {filters, [apiSlice.reducerPath]: apiSlice.reducer},
    // подключаем готовый middleware, который уже существует внутри объекта apiSlice
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware, apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export default store;
