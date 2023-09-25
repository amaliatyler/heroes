import { useState, useEffect } from 'react';
// import { Select } from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import { filtersFetched, heroAdded } from '../../actions';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const { filters } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        request("http://localhost:3001/filters")
        .then(data => dispatch(filtersFetched(data)))
    // eslint-disable-next-line
    }, [])

    const onHeroCreated = (data) => {
        console.log(data)
        request("http://localhost:3001/heroes", "POST", data)
        .then(data => dispatch(heroAdded(data)))
    };

    const renderFilters = (arr) => {

        return arr.map((item, i) => {
            return (
                <option key={i} value={item[0]}>{item[1]}</option>
            )
        })
    }

    const filterOptions = renderFilters(filters);

    return (
        <Formik
            initialValues={{
                id: '',
                name: '',
                description: '',
                element: '',
            }}
            validationSchema={yup.object({
                name: yup
                    .string()
                    .required('Обязательное поле')
                    .min(2, "Имя должно содержать не менее двух символов"),
                description: yup
                    .string()
                    .required('Обязательное поле')
                    .min(4, 'Описание персонажа должно состоять минимум из одного слова'),
                element: yup
                    .string()
                    .required('Пожалуйста, выберите элемент для своего персонажа')
                    .oneOf(['all', 'fire', 'water', 'wind', 'earth']),
            })}
            onSubmit={(values) => {
                const id = uuidv4();
                values.id = id;
                onHeroCreated(JSON.stringify(values, null, 2));
                console.log(JSON.stringify(values, null, 2));
            }}
        >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">
                        Имя нового героя
                    </label>
                    <Field
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Как меня зовут?"
                    />
                    <ErrorMessage name="name" component="div" />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label fs-4">
                        Описание
                    </label>
                    <Field
                        as="textarea"
                        name="description"
                        className="form-control"
                        id="description"
                        placeholder="Что я умею?"
                        style={{ height: '130px' }}
                    />
                    <ErrorMessage name="description" component="div" />
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">
                        Выбрать элемент героя
                    </label>
                    <Field
                        as="select"
                        required
                        className="form-select"
                        id="element"
                        name="element"
                    >
                        {/* <option value="">-- Выберите элемент --</option>
                        <option value="fire">Огонь</option>
                        <option value="water">Вода</option>
                        <option value="wind">Ветер</option>
                        <option value="earth">Земля</option>
                        <option value="all">Все элементы</option> */}
                        {filterOptions}
                    </Field>
                    <ErrorMessage name="element" component="div" />
                </div>

                <button type="submit" className="btn btn-primary">
                    Создать
                </button>
            </Form>
        </Formik>
    );
};

export default HeroesAddForm;
