import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    // название редьюсера, т.е. все наши данные будут помещены в store.api
    reducerPath: 'api',
    // следующие 2 поля обязательные
    // baseQuery - по факту это метод, или функция, которая будет делать запрос
    // так что здесь можно было бы написать fetch с каким-то адресом, но мы будем использовать встроенный fetch
    // т.к. он имеет ряд преимуществ
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3001'}),
    // те операции, которые мы будем проводить по базовому адресу, к примеру, получение данных, отправка данных, удаление или обновление
    endpoints: 
})