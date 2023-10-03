import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
};

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
        heroCreated: (state, action) => { state.heroes.push(action.payload)},
        heroDeleted: (state, action) => { state.heroes = state.heroes.filter(item => item.id !== action.payload)}
    },
    // т.к. fetchHeroes создается как бы вне createSlice, они считаются сторонними actionCreators
    // они записываются в поле для extraReducers
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => { state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                state.heroes = action.payload;
            })
            .addCase(fetchHeroes.rejected, state => { state.heroesLoadingStatus = 'error'})
            .addCase(() => {})

    }
});

const { actions, reducer } = heroesSlice;

export default reducer;
export const {
    heroesFetching, 
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;