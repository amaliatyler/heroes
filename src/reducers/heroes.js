import { createReducer } from '@reduxjs/toolkit';

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted,
} from '../actions';

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
};

// функция createReducer принимает в себя два аргумента - initial state и функцию для создания редьюсеров
// builder - объект, который позволяет конструировать редьюсер с помощью трех уже встроенных в него методов
// const heroes = createReducer(initialState, builder => {
//     builder
//         .addCase(heroesFetching, state => {
//             // можем напрямую менять стейт, т.к. immer под капотом соблюдает иммутабельность
//             // immer не будет работать, если функция будет что-то "возвращать", к примеру, с помощью ключевого слова return
//             // т.е. если что-то мутируем напрямую, нельзя возвращать значение
//             state.heroesLoadingStatus = 'loading';
//         })
//         .addCase(heroesFetched, (state, action) => {
//             state.heroesLoadingStatus = 'idle';
//             state.heroes = action.payload;
//         })
//         .addCase(heroesFetchingError, state => {
//             state.heroesLoadingStatus = 'error';
//         })
//         .addCase(heroCreated, (state, action) => {
//             state.heroes.push(action.payload);
//         })
//         .addCase(heroDeleted, (state, action) => {
//             state.heroes = state.heroes.filter(item => item.id !== action.payload);
//         })
//         .addDefaultCase(() => {});
// });

const heroes = createReducer(initialState, {
     // при таком синтаксисе нужны фигурные скобки, т.к. без них функция будет "возвращать" измененный стейт, что даст ошибки (см выше)
    [heroesFetching]: (state) => { state.heroesLoadingStatus = 'loading'},
    [heroesFetched]: (state, action) => {
                        state.heroesLoadingStatus = 'idle';
                        state.heroes = action.payload;
                    },
    [heroesFetchingError]: state => { state.heroesLoadingStatus = 'error'},
    [heroCreated]: (state, action) => { state.heroes.push(action.payload)},
    [heroDeleted]: (state, action) => { state.heroes = state.heroes.filter(item => item.id !== action.payload)
                }
            },
    // третий аргумент такой функции - массив функций сравнения
    [],
    // дефолтный кейс
    state => state
);

// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading',
//             };
//         case 'HEROES_FETCHED':
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 heroesLoadingStatus: 'idle',
//             };
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error',
//             };
//         case 'HERO_CREATED':
//             return {
//                 ...state,
//                 heroes: [...state.heroes, action.payload],
//             };
//         case 'HERO_DELETED':
//             return {
//                 ...state,
//                 heroes: state.heroes.filter(
//                     (item) => item.id !== action.payload
//                 ),
//             };
//         default:
//             return state;
//     }
// };

export default heroes;
