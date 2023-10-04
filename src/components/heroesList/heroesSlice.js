import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

// при вызове эта функция вернет объект с готовыми методами, коллбэками, мемоизир ованными селекторами и определенной структурой
// обычно адаптер передается в качестве начального значения при создании слайса
// при создании адаптер может принять в себя объект с коллбэками 
const heroesAdapter = createEntityAdapter();


const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle',
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const { request } = useHttp();
        // async await уже используются в запросе в useHttp, поэтому здесь их прописывать необходимости нет
        return request('http://localhost:3001/heroes');
    }
)

// * в этой функции можно прописать и синхронный код, но тогда 
// нужно будет вручную вернуть ошибку (*throw error) на случай, если что-то пойдет не так


const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroCreated: (state, action) => { heroesAdapter.addOne(state, action.payload)},
        heroDeleted: (state, action) => { heroesAdapter.removeOne(state, action.payload)}
    },
    // т.к. fetchHeroes создается как бы вне createSlice, они считаются сторонними actionCreators
    // они записываются в поле для extraReducers
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => { state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                // setAll полностью заменит изначальные данные на пришедшие
                // для обычного добавления новых данных использовать setMany
                heroesAdapter.setAll(state, action.payload);
            })
            .addCase(fetchHeroes.rejected, state => { state.heroesLoadingStatus = 'error'})
            .addCase(() => {})

    }
});

const { actions, reducer } = heroesSlice;

export default reducer;

// создаем объект, вытаскиваем сразу selectAll из этого объекта и экспортируем для использования в HeroesList
const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);
// сразу экспотируем готовый селектор
export const filteredHeroesSelector = createSelector(
    // state автоматически подставляется как аргумент
    (state) => state.filters.activeFilter,
    selectAll,
    (filter, heroes) => {
        if (filter === 'all') {
            return heroes;
        } else {
            return heroes.filter((item) => item.element === filter);
        }
    }
);

export const {
    heroesFetching, 
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;