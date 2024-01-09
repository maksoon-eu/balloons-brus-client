import React, { useContext, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, Navigate } from "react-router-dom";
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

import '../../style/style.scss';

const App = observer(() => {
    const {items, user} = useContext(Context)

    useEffect(() => {
      check()
      .then(data => {
        user.setUser(true)
        user.setIsAuth(true)
      }).catch(e => {
        console.log(e.message)
      })
    }, [])

    useEffect(() => {
      let totalPrice = 0;
      items.cart.forEach(item => {
          totalPrice += item[2] * item[1]
      })
      items.setTotalPrice(totalPrice)
  }, [items.cart])

    return (
        <div className="app">
          <Header/>
          <AnimatePresence mode="wait">
            <Routes>
              {user.isAuth && <Route path="/admin" element={<AdminPage/>}/>}
              {/* <Route path="/admin" element={<AdminPage/>}/> */}
              <Route path="/" element={<MainPage/>}/>
              <Route path="/cart" element={<CartPage/>}/>
              <Route path="/catalog" element={<CatalogPage/>}/>
              <Route path="/catalog/:id" element={<ItemPage/>}/>
              <Route path="/info" element={<AboutPage/>}/>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="*" element={<Navigate to="/" replace />}/>
            </Routes>
          </AnimatePresence>
          <Footer/>
        </div>
    );
});

export default App;