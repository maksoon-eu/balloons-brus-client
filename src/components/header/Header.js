import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

import logo from '../../resources/logo.svg';
import name from '../../resources/name.png';
import clock from '../../resources/clock.svg';
import tel from '../../resources/tel.svg';

import './header.scss';

const Header = observer(() => {
    const { items, user } = useContext(Context);

    return (
        <header className="header">
            <div itemScope itemType="http://schema.org/Organization" className="header__inner">
                <Link to="/" className="header__inner-logo">
                    <img className="header__inner-img" src={logo} alt="" />
                    <img className="header__inner-text" src={name} alt="" />
                </Link>
                <div className="header__inner-info">
                    <div className="header__info-time">
                        <div className="header__time-title">Время работы:</div>
                        <div className="header__time-group">
                            <img className="header__time-img" src={clock} alt="" />
                            <div className="header__time-text">Пн-Вс 9-21</div>
                        </div>
                    </div>
                    <div className="header__info-tel">
                        <div className="header__tel-title">Номер для звонка:</div>
                        <div className="header__tel-group">
                            <img className="header__tel-img" src={tel} alt="" />
                            <a
                                itemProp="telephone"
                                href="tel:89039399494"
                                className="header__tel-text">
                                +7 (903) 939-94-94
                            </a>
                        </div>
                    </div>
                </div>
                <nav itemScope itemType="http://schema.org/SiteNavigationElement">
                    <ul className="header__inner-btns">
                        <motion.li
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.9 }}>
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
                        </motion.li>
                        <motion.li
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.9 }}>
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
                        </motion.li>
                    </ul>
                </nav>
                <div className="header__inner-icons">
                    {user.isAuth && (
                        <div className="header__icons-admin">
                            <Link to="/admin">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 41 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.7108 37.999H7.20161C6.64985 37.999 6.10354 37.8881 5.59378 37.6725C5.08402 37.457 4.6207 37.1411 4.23054 36.7428C3.84039 36.3446 3.53093 35.8718 3.31978 35.3514C3.10863 34.8311 3 34.2734 3 33.7101V25.7822C2.99954 24.6727 3.42187 23.6065 4.1777 22.8092L19.2768 6.75423C19.3038 6.7121 19.3328 6.67118 19.3634 6.6316C19.4601 6.50687 19.5729 6.39731 19.6984 6.30592L23.2758 2.50203C24.0168 1.71298 24.9061 1.08469 25.8906 0.654805C26.875 0.224915 27.9344 0.00230141 29.0052 0.000225502C30.0467 -0.00546473 31.0789 0.201424 32.0409 0.608747C33.003 1.01607 33.8755 1.6156 34.6073 2.37209L36.6923 4.48402C37.4284 5.23402 38.0112 6.12564 38.4074 7.10724C38.8035 8.08885 39.0049 9.14094 38.9999 10.2026V10.6899C39.0049 11.7515 38.8035 12.8036 38.4074 13.7852C38.0112 14.7668 37.4284 15.6584 36.6923 16.4084L33.9943 19.1625C33.9997 19.2291 34.0013 19.2962 33.999 19.3637C33.984 19.8132 33.7987 20.2379 33.484 20.5446C33.1693 20.8513 32.7508 21.0148 32.3208 20.9991L32.3045 20.9821H32.2117L16.7666 36.7481C16.3665 37.1566 15.8895 37.4781 15.3643 37.6931C14.8391 37.9081 14.2765 38.0122 13.7108 37.999ZM28.4528 20.12L14.3634 34.3762C14.174 34.5717 13.9166 34.6827 13.6473 34.6849H7.13788C7.00412 34.6849 6.87174 34.658 6.74817 34.6057C6.62459 34.5535 6.51228 34.4769 6.4177 34.3803C6.32312 34.2838 6.248 34.1692 6.19681 34.043C6.14562 33.9169 6.11929 33.7817 6.11929 33.6452V25.7822C6.12294 25.5156 6.22536 25.2602 6.40585 25.0674L19.6262 10.9988C21.189 16.1164 25.045 18.8586 28.4528 20.12ZM31.1404 17.4005L34.3526 14.1503C35.2347 13.2425 35.732 12.0172 35.7372 10.7386V10.2513C35.732 8.97272 35.2347 7.74745 34.3526 6.83967L32.2679 4.71148C31.3863 3.7932 30.1851 3.26769 28.9257 3.24937C28.2864 3.25196 27.6541 3.38559 27.0663 3.64233C26.4785 3.89907 25.9472 4.27366 25.504 4.74396L22.3256 8.12623C23.3012 14.8731 28.6283 16.8438 31.1404 17.4005ZM39.3659 44.0001H1.63412C1.20072 44.0001 0.785103 43.8421 0.478646 43.5608C0.172189 43.2795 0 42.8979 0 42.5001C0 42.1023 0.172189 41.7208 0.478646 41.4395C0.785103 41.1582 1.20072 41.0001 1.63412 41.0001H39.3659C39.7993 41.0001 40.215 41.1582 40.5215 41.4395C40.8279 41.7208 41 42.1023 41 42.5001C41 42.8979 40.8279 43.2795 40.5215 43.5608C40.215 43.8421 39.7993 44.0001 39.3659 44.0001Z"
                                        fill="#4B5563"
                                    />
                                </svg>
                            </Link>
                        </div>
                    )}
                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            isActive ? 'header__icons-cart active' : 'header__icons-cart'
                        }>
                        <div className="header__cart-img">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 19 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                {items.cart.length > 0 && (
                                    <circle cx="17" cy="2" r="2" fill="#DC2626" />
                                )}
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.75739 5.16649V5.01204C3.80914 3.66519 4.37608 2.39088 5.33931 1.45643C6.30255 0.521977 7.58725 0 8.92385 0C10.2604 0 11.5451 0.521977 12.5083 1.45643C13.4715 2.39088 14.0385 3.66519 14.0902 5.01204V5.16649H14.5959C15.1188 5.16662 15.6357 5.27651 16.1131 5.48901C16.5904 5.70151 17.0176 6.01186 17.3666 6.39983C17.7156 6.7878 17.9786 7.24469 18.1386 7.74074C18.2986 8.23679 18.352 8.76087 18.2953 9.27884L17.4181 17.3135C17.3289 18.2315 16.8998 19.0835 16.2145 19.7033C15.5291 20.3231 14.6366 20.6662 13.7111 20.6657H5.04632C4.16193 20.669 3.30562 20.3565 2.63256 19.7847C1.9595 19.213 1.51421 18.4199 1.37745 17.5491L0.0579117 9.51448C-0.0386893 8.97795 -0.014201 8.4267 0.129606 7.90078C0.273412 7.37485 0.532902 6.88745 0.889281 6.47393C1.23915 6.06439 1.67406 5.73541 2.16394 5.50968C2.65382 5.28395 3.18707 5.16686 3.72678 5.16649H3.75739ZM12.5399 5.01204H5.30771C5.35078 4.07411 5.75055 3.18898 6.42398 2.54059C7.09742 1.89221 7.99276 1.53042 8.92385 1.53042C9.85493 1.53042 10.7502 1.89221 11.4236 2.54059C12.0971 3.18898 12.4968 4.07411 12.5399 5.01204ZM2.80397 6.92777C3.09314 6.79419 3.40806 6.72493 3.72678 6.72478L14.5807 6.69437C14.8885 6.69589 15.1926 6.76167 15.4734 6.88745C15.7542 7.01323 16.0055 7.19623 16.211 7.42467C16.4165 7.65311 16.5717 7.92192 16.6666 8.21377C16.7615 8.50562 16.7941 8.81406 16.7621 9.11921L15.9002 17.1919C15.8418 17.7294 15.5859 18.2264 15.1817 18.5871C14.7775 18.9478 14.2537 19.1467 13.7111 19.1454H5.04632C4.5245 19.1464 4.01948 18.9616 3.62231 18.6243C3.22513 18.2871 2.96195 17.8195 2.88014 17.3059L1.5605 9.27123C1.50849 8.95786 1.5256 8.63696 1.6105 8.33081C1.6954 8.02466 1.84611 7.74059 2.05221 7.49831C2.25831 7.25603 2.51481 7.06134 2.80397 6.92777ZM5.63607 11.2722C6.15485 11.2722 6.57542 10.8517 6.57542 10.3329C6.57542 9.8141 6.15485 9.39354 5.63607 9.39354C5.11728 9.39354 4.69672 9.8141 4.69672 10.3329C4.69672 10.8517 5.11728 11.2722 5.63607 11.2722ZM13.1508 10.3329C13.1508 10.8517 12.7303 11.2722 12.2115 11.2722C11.6927 11.2722 11.2722 10.8517 11.2722 10.3329C11.2722 9.8141 11.6927 9.39354 12.2115 9.39354C12.7303 9.39354 13.1508 9.8141 13.1508 10.3329Z"
                                    fill="#4B5563"
                                />
                            </svg>
                        </div>
                        <div className="header__cart-text">
                            <div className="header__cart-title">
                                Товаров <span>{items.cart.length}</span>
                            </div>
                            <div className="header__cart-cost">{`${items.totalPrice} ₽`}</div>
                        </div>
                    </NavLink>
                </div>
            </div>
        </header>
    );
});

export default Header;
