import { useDispatch, useSelector } from 'react-redux';

import { useHttp } from '../../hooks/http.hook';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { heroCreated } from '../../actions';


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

    // в стейте из-за combineReducers теперь объект со свойством filters
    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const { request } = useHttp();   

    const onHandleSubmit = (data) => {
        request('http://localhost:3001/heroes', 'POST', JSON.stringify(data))
        .then((data) => dispatch(heroCreated(data))
        .catch(err => console.log(err))
        );
    };

    const renderFilters = (filters, status) => {
        if(status === 'loading') {
            return <option>Загрузка элементов</option>
        } else if(status === 'error') {
            return <option>Ошибка загрузки</option>
        }

        if(filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if(name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

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
                    .min(2, 'Имя должно содержать не менее двух символов'),
                description: yup
                    .string()
                    .required('Обязательное поле')
                    .min(
                        4,
                        'Описание персонажа должно состоять минимум из одного слова'
                    ),
                element: yup
                    .string()
                    .required(
                        'Пожалуйста, выберите элемент для своего персонажа'
                    )
                    .oneOf(['all', 'fire', 'water', 'wind', 'earth']),
            })}
            onSubmit={(values) => {
                const id = uuidv4();
                values.id = id;
                onHandleSubmit(values, null, 2);
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
                        <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
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
