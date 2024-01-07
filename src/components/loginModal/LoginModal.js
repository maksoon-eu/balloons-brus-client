import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { login } from '../../http/userApi';
import { Context } from "../..";
import { observer } from 'mobx-react-lite';

import './loginModal.scss';

const LoginModal = observer(() => {
    const [userLogin, setUserLogin] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [toggleError, setToggleError] = useState(false);

    const navigate = useNavigate();

    const {user} = useContext(Context);

    const signIn = async () => {
        if (userLogin !== '' && userPassword !== '') {
            try {
                const data = await login(userLogin, userPassword)
                setToggleError(false)
                user.setIsAuth(true)
                navigate("/admin")
                
            } catch(e) {
                setLoginError(e.response.data.message)
                setToggleError(true)
            }
        }
    }

    return (
        <div className="modal">
            <form action="" className="modal__form">
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
                <motion.div
                    className="modal__btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={signIn}
                >Войти</motion.div>
            </form>
        </div>
    )
})

export default LoginModal;