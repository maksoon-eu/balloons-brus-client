import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { login, change } from '../../http/userApi';
import { Context } from "../..";
import { observer } from 'mobx-react-lite';

import './loginModal.scss';

const LoginModal = observer(() => {
    const [userLogin, setUserLogin] = useState(localStorage.getItem('login') ? localStorage.getItem('login') : '');
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordChange, setUserPasswordChange] = useState('');
    const [userPasswordChangeAgain, setUserPasswordChangeAgain] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginErrorPassword, setLoginErrorPassword] = useState('');
    const [toggleError, setToggleError] = useState(false);
    const [toggleErrorPassword, setToggleErrorPassword] = useState(false);
    const [changePassword, setChangePassword] = useState(false)

    const navigate = useNavigate();

    const {user} = useContext(Context);

    const signIn = async () => {
        if (userLogin !== '' && userPassword !== '') {
            try {
                const data = await login(userLogin, userPassword)
                setToggleError(false)
                user.setIsAuth(true)
                navigate("/admin")
                localStorage.setItem('login', userLogin)
            } catch(e) {
                setLoginError(e.response.data.message)
                setToggleError(true)
            }
        }
    }

    const onChangePassword = async () => {
        if (userPasswordChange !== '' && userPasswordChangeAgain !== '') {
            if (userPasswordChange === userPasswordChangeAgain) {
                try {
                    const data = await change(localStorage.getItem('login'), userPasswordChange)
                    setToggleErrorPassword(false)
                    setChangePassword(false)
                    
                } catch(e) {
                    setLoginErrorPassword(e.response.data.message)
                    setToggleErrorPassword(true)
                }
            } else {
                setLoginErrorPassword('Пароли не совпадают')
            }
        }
    }

    const variants = {
        open: { opacity: 1, y: 0, display: 'block', transition: {delay: .2}},
        closed: { opacity: 0, y: "-20px", display: 'none', transition: {display: {delay: .1}} },
    }

    return (
        <div className="modal">
            <motion.form 
                action="" 
                className="modal__form modal__form-login"
                animate={!changePassword ? "open" : "closed"}
                variants={variants}
                initial={{ opacity: 0, y: "-20px", display: 'none' }}
            >
                <div className="modal__title">Админ панель</div>
                <div className="modal__form-login">
                    <input 
                        type="text" 
                        required
                        className="input-default"
                        value={userLogin}
                        onChange={e => {setUserLogin(e.target.value); setToggleError(false)}}
                        id='login'
                    />
                    <label className="input-label" htmlFor="login">Логин</label>
                </div>
                <div className="modal__form-password">
                    <input 
                        type="password" 
                        required
                        className="input-default"
                        value={userPassword}
                        onChange={e => {setUserPassword(e.target.value); setToggleError(false)}}
                        id='password'
                    />
                    <label className="input-label" htmlFor="password">Пароль</label>
                </div>
                <div className='modal__error' style={{color: toggleError ? '#E84D4D' : 'transparent'}}>{loginError}</div>
                <div className="login__flex">
                    <motion.div
                        className="modal__btn"
                        whileHover={{ scale: 1.05, translateY: -3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={signIn}
                    >Войти</motion.div>
                    {user.isAuth && 
                        <motion.div
                            className="modal__btn"
                            whileHover={{ scale: 1.05, translateY: -3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setChangePassword(true)}
                        >Сменить пароль</motion.div>}
                </div>
            </motion.form>

            <motion.form 
                action=""
                className="modal__form modal__form-password"
                animate={changePassword ? "open" : "closed"}
                variants={variants}
                initial={{ opacity: 0, y: "-20px" }}
            >
                <div className="modal__title">Смена пароля</div>
                <div className="modal__form-login">
                    <input 
                        type="password" 
                        required
                        className="input-default"
                        value={userPasswordChange}
                        onChange={e => {setUserPasswordChange(e.target.value); setToggleError(false)}}
                        id='change'
                    />
                    <label className="input-label" htmlFor="change">Новый пароль</label>
                </div>
                <div className="modal__form-password">
                    <input 
                        type="password" 
                        required
                        className="input-default"
                        value={userPasswordChangeAgain}
                        onChange={e => {setUserPasswordChangeAgain(e.target.value); setToggleError(false)}}
                        id='passwordChange'
                    />
                    <label className="input-label" htmlFor="passwordChange">Повторите пароль</label>
                </div>
                <div className='modal__error' style={{color: toggleErrorPassword ? '#E84D4D' : 'transparent'}}>{loginErrorPassword}</div>
                <div className="login__flex">
                    <motion.div
                        className="modal__btn"
                        whileHover={{ scale: 1.05, translateY: -3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setChangePassword(false)}
                    >Страница входа</motion.div>
                    <motion.div
                        className="modal__btn"
                        whileHover={{ scale: 1.05, translateY: -3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onChangePassword}
                    >Сменить</motion.div>
                </div>
            </motion.form>
        </div>
    )
})

export default LoginModal;