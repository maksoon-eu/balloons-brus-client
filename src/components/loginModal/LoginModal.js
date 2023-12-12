import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { login } from '../../http/userApi';
import { Context } from "../..";

import './loginModal.scss';
import { observer } from 'mobx-react-lite';

const LoginModal = observer(({loginModal, setLoginModal, refLogin}) => {
    const [userLogin, setUserLogin] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [toggleError, setToggleError] = useState(false);

    const navigate = useNavigate();

    const {user} = useContext(Context);

    useEffect(() => {
        const clickOutElement = (e) => {
            if (loginModal && refLogin.current && !refLogin.current.contains(e.target)) {
                setLoginModal(false)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [loginModal])

    const signIn = async () => {
        if (userLogin !== '' && userPassword !== '') {
            try {
                const data = await login(userLogin, userPassword)
                setToggleError(false)
                user.setIsAuth(true)
                navigate("/admin");
                setLoginModal(false);
                
            } catch(e) {
                setLoginError(e.response.data.message)
                setToggleError(true)
            }
        }
    }

    return (
        <motion.div 
            className="modal" 
            initial={{ opacity: 0 }}
            variants={{open: {opacity: 1, display: 'block'}, closed: {opacity: 0, display: 'none', transition: {display: {delay: .2}}}}}
            animate={loginModal ? "open" : "closed"}
            transition={{ duration: 0.2 }}
        >
            <form action="" className="modal__form">
                <div className="modal__title">Админ панель</div>
                <input 
                    type="text" 
                    className="modal__input" 
                    placeholder='Логин' 
                    value={userLogin}
                    onChange={e => {setUserLogin(e.target.value); setToggleError(false)}}
                />
                <input 
                    type="password" 
                    className="modal__input" 
                    placeholder='Пароль' 
                    value={userPassword}
                    onChange={e => {setUserPassword(e.target.value); setToggleError(false)}}
                />
                <div className='modal__error' style={{color: toggleError ? '#E84D4D' : 'transparent'}}>{loginError}</div>
                <motion.div
                    className="modal__btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={signIn}
                >Войти</motion.div>
            </form>
        </motion.div>
    )
})

export default LoginModal;