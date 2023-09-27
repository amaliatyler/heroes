const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all',
    filteredHeroes: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading',
            };
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                filteredHeroes:
                    state.activeFilter === 'all'
                        ? action.payload
                        : action.payload.filter(
                            (item) => item.element === state.activeFilter
                        ),
                heroesLoadingStatus: 'idle',
            };
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error',
            };
        case 'FILTERS_FETCHING':
            return {
                ...state,
                filtersLoadingStatus: 'loading',
            };
        case 'FILTERS_FETCHED':
            return {
                ...state,
                filters: action.payload,
                filtersLoadingStatus: 'idle',
            };
        case 'FILTERS_FETCHING_ERROR':
            return {
                ...state,
                filetrsLoadingStatus: 'error',
            };
        case 'ACTIVE_FILTER_CHANGED':
            return {
                ...state,
                activeFilter: action.payload,
                filteredHeroes:
                    action.payload === 'all'
                        ? state.heroes
                        : state.heroes.filter(item => item.element === action.payload),
            };
        case 'HERO_CREATED':
            // формируем новый массив
            let newCreatedHeroList = [...state.heroes, action.payload];
            return {
                ...state,
                heroes: newCreatedHeroList,
                // фильтруем данные по фильтру, который сейчас применяется
                filteredHeroes: state.activeFilter === 'all' ? newCreatedHeroList : newCreatedHeroList.filter(item => item.element === state.activeFilter),
            };
        case 'HERO_DELETED':
            // формируем новый массив
            let newHeroList = state.heroes.filter(item => item.id !== action.payload);
            return {
                ...state,
                heroes: newHeroList,
                // фильтруем данные по фильтру, который сейчас применяется
                filteredHeroes: state.activeFilter === 'all'? newHeroList : newHeroList.filter(item => item.element === state.activeFilter)
            };
        default:
            return state;
    }
};

export default reducer;
