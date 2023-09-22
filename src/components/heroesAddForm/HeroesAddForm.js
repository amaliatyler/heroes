import { useState } from 'react';
// import { Select } from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

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
    const [hero, setHero] = useState(null);

    const onHeroCreated = (data) => {
        setHero(data);
    };

    const elementOptions = [
        { label: 'огонь', value: 'fire' },
        { label: 'вода', value: 'water' },
        { label: 'воздух', value: 'air' },
        { label: 'земля', value: 'earth' },
    ];

    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
                element: '',
            }}
            validationSchema={yup.object({
                name: yup
                    .string()
                    .required('This field is required')
                    .min(2, "Hero's name must contain at least 2 characters"),
                description: yup
                    .string()
                    .min(4, 'Please describe your hero with at least one word'),
                element: yup
                    .string()
                    .required('Please select an element for your hero')
                    .oneOf(['all', 'fire', 'water', 'wind', 'earth']),
            })}
            onSubmit={async (values) => {
                await new Promise((r) => setTimeout(r, 500));
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
                    <textarea
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
                    <select
                        required
                        className="form-select"
                        id="element"
                        name="element"
                    >
                        <option value="all">Я владею элементом...</option>
                        <option value="fire">Огонь</option>
                        <option value="water">Вода</option>
                        <option value="wind">Ветер</option>
                        <option value="earth">Земля</option>
                    </select>
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
