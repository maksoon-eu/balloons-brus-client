import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import promo from '../../resources/promo.svg';

import './notFount.scss';

const NotFound = () => {
    return (
        <div className="notFound">
            <div className="notFound__img">
                <img src={promo} alt="" />
            </div>

            <div className="notFound__title">Страница не найдена!</div>

            <div className="notFound__btns">
                <motion.div whileHover={{ scale: 1.05, translateY: -2 }} whileTap={{ scale: 0.9 }}>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? 'header__inner-catalog header__inner-catalog-active'
                                : 'header__inner-catalog'
                        }
                        itemProp="url">
                        <span itemProp="name">Главная</span>
                    </NavLink>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, translateY: -2 }} whileTap={{ scale: 0.9 }}>
                    <NavLink
                        to="/catalog"
                        className={({ isActive }) =>
                            isActive
                                ? 'header__inner-catalog header__inner-catalog-active'
                                : 'header__inner-catalog'
                        }
                        itemProp="url">
                        <span itemProp="name">Каталог</span>
                    </NavLink>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, translateY: -2 }} whileTap={{ scale: 0.9 }}>
                    <NavLink
                        to="/info"
                        className={({ isActive }) =>
                            isActive
                                ? 'header__inner-catalog header__inner-catalog-active'
                                : 'header__inner-catalog'
                        }
                        itemProp="url">
                        <span itemProp="name">Доставка</span>
                    </NavLink>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
