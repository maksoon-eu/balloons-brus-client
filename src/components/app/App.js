import React, { Suspense, useContext, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { check } from '../../http/userApi';
import { Context } from '../..';

import Header from '../header/Header';
import Footer from '../footer/Footer';
import BottomPanel from '../bottomPanel/BottomPanel';

import { AdminPageAsync } from '../../page/Admin/AdminPage.async';
import { MainPageAsync } from '../../page/Main/MainPage.async';
import { CartPageAsync } from '../../page/Cart/CartPage.async';
import { CatalogPageAsync } from '../../page/Catalog/CatalogPage.async';
import { ItemPageAsync } from '../../page/Item/ItemPage.async';
import { AboutPageAsync } from '../../page/About/AboutPage.async';
import { LoginPageAsync } from '../../page/Login/LoginPage.async';
import { NotFoundPageAsync } from '../../page/NotFound/NotFoundPage.async';

import 'react-widgets/scss/styles.scss';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../../style/style.scss';

const App = observer(() => {
    const contactRef = useRef(null);

    const { items, user } = useContext(Context);

    useEffect(() => {
        check()
            .then((data) => {
                user.setUser(true);
                user.setIsAuth(true);
            })
            .catch((e) => {
                console.error("Ошибка авторизации:", e.message);
                localStorage.removeItem('token');
                user.setUser(false);
                user.setIsAuth(false);
            });
    }, []);

    useEffect(() => {
        let totalPrice = 0;
        items.cart.forEach((item) => {
            totalPrice += item[2] * item[1];
        });
        items.setTotalPrice(totalPrice);
    }, [items.cart]);

    const scrollToComponent = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="app">
            <Header />
            <Suspense fallback="">
                <AnimatePresence mode="wait">
                    <Routes>
                        {user.isAuth && <Route path="/admin" element={<AdminPageAsync />} />}
                        <Route
                            path="/"
                            element={
                                <MainPageAsync
                                    scrollToComponent={scrollToComponent}
                                    contactRef={contactRef}
                                />
                            }
                        />
                        <Route path="/cart" element={<CartPageAsync />} />
                        <Route path="/catalog" element={<CatalogPageAsync />} />
                        <Route path="/catalog/:id" element={<ItemPageAsync />} />
                        <Route path="/info" element={<AboutPageAsync />} />
                        <Route path="/login" element={<LoginPageAsync />} />
                        <Route path="*" element={<NotFoundPageAsync />} />
                    </Routes>
                </AnimatePresence>
                <BottomPanel />
            </Suspense>
            <Footer contactRef={contactRef} />
        </div>
    );
});

export default App;
