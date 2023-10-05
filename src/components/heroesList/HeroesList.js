import {  useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// импортируем хук, который будет работать с нашими героями
import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice';
import HeroesListItem from '../heroesListItem/HeroesListItem';
import Spinner from '../spinner/Spinner';

const HeroesList = () => {

    // создаем объект с помощью вызова нашего хука
    // из объекта деструктурируем данные, которые возвращает fetch
    const {
        // полученные данные записываем в переменную heroes
        data: heroes = [],
        // помимо данных здесь так же есть различные состояния
        isLoading,
        isError,
    } = useGetHeroesQuery();

    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter);

    // если компонент будет перерендериваться - данные будут заново фильтроваться
    // поэтому можно сразу воспользоваться хуком useMemo для оптимизации
    // чтобы не фильтровать данные при перерендеринге, если ничего не изменилось (т.е. переменная heroes)
    // т.е если они поменялись, фильтруем заново, если нет - оставляем как есть
    const filteredHeroes = useMemo(() => {
        // создаем копию элемента, чтобы не мутировать оригинальные данные
        const filteredHeroes = heroes.slice();

        if (activeFilter === 'all') {
            return filteredHeroes;
        } else {
            return filteredHeroes.filter((item) => item.element === activeFilter);
        }
    }, [heroes, activeFilter]);

    // оборачиваем в useCallback, т.к. эта функция передается вниз по иерархии и без коллбэка будет вызывать лишний перерендеринг компонента
    const onDelete = useCallback((id) => {
        deleteHero(id)
            // eslint-disable-next-line
        }, []);

    if (isLoading) {
        return <Spinner />;
    } else if (isError) {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition timeout={0} classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            );
        }

        return arr.map(({ id, ...props }) => {
            return (
                <CSSTransition timeout={300} key={id} classNames="hero">
                    <HeroesListItem {...props} onDelete={() => onDelete(id)} />
                </CSSTransition>
            );
        });
    };

    const elements = renderHeroesList(filteredHeroes);

    return <TransitionGroup component="ul">
                {elements}
            </TransitionGroup>;
};

export default HeroesList;
