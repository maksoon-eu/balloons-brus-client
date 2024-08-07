import React, { useContext, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { check } from "../../http/userApi";
import { Context } from "../..";

import Header from "../header/Header";
import MainPage from "../../page/MainPage";
import AdminPage from "../../page/AdminPage";
import CartPage from "../../page/CartPage";
import CatalogPage from "../../page/CatalogPage";
import ItemPage from "../../page/ItemPage";
import AboutPage from "../../page/AboutPage";
import LoginPage from "../../page/LoginPage";
import Footer from "../footer/Footer";
import BottomPanel from "../bottomPanel/BottomPanel";
import NotFoundPage from "../../page/NotFoundPage";

import '../../style/style.scss';

const App = observer(() => {
  const contactRef = useRef(null);

  const {items, user} = useContext(Context);

  useEffect(() => {
    check()
    .then(data => {
      user.setUser(true)
      user.setIsAuth(true)
    }).catch(e => {
      console.error(e.message)
    })
  }, [])

  useEffect(() => {
    let totalPrice = 0;
    items.cart.forEach(item => {
      totalPrice += item[2] * item[1]
    })
    items.setTotalPrice(totalPrice)
  }, [items.cart])

  const scrollToComponent = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <div className="app">
        <Header/>
        <AnimatePresence mode="wait">
          <Routes>
            {user.isAuth && <Route path="/admin" element={<AdminPage/>}/>}
            <Route path="/" element={<MainPage scrollToComponent={scrollToComponent} contactRef={contactRef}/>}/>
            <Route path="/cart" element={<CartPage/>}/>
            <Route path="/catalog" element={<CatalogPage/>}/>
            <Route path="/catalog/:id" element={<ItemPage/>}/>
            <Route path="/info" element={<AboutPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
          </Routes>
        </AnimatePresence>
        <BottomPanel/>
        <Footer contactRef={contactRef}/>
      </div>
  );
});

export default App;