import React, { useState } from "react";
import InputMask from 'react-input-mask';
import { motion } from "framer-motion";
import { sendMessage } from "../../http/orderApi";
import { useInputsChange } from "../../hooks/inputs.hook";

import ThanksModal from "../thanksModal/ThanksModal";

import './sendMessage.scss';

const SendMessage = () => {
    const [inputs, setInputs] = useState(['', '', '']);
    const [inputError, setInputError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false)

    const onSendMessage = () => {
        if (inputs[0].length < 2 || inputs[1].includes('_') || inputs[2].length < 2) {
            setInputError('Заполните все поля')
        } else {
            setLoading(true)
            const formData = new FormData()
            formData.append('name', inputs[0])
            formData.append('tel', inputs[1])
            formData.append('comment', inputs[2])
            sendMessage(formData)
                .then(data => {
                    setInputs(['', '', ''])
                    setLoading(false)
                    setOpenModal(true)
                })
                .catch(e => {
                    console.log(e.message)
                    setLoading(false)
                })
        }
    }

    return (
        <>
        <ThanksModal openModal={openModal} setOpenModal={setOpenModal} />
        <div className="message">
            <div className="message__inner">
                <div className="message__inner-title">Не нашли подходящий вариант?</div>
                <div className="message__inner-text">оставьте ваши контакты и мы подберем под вас уникальную композицию</div>
                <div className="message__inner-order">
                    <div className="order__name order__input">
                        <input 
                            type="text" 
                            required
                            className="input-default"
                            value={inputs[0]} 
                            name='0' 
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                            id='name'
                        />
                        <label className="input-label" htmlFor="name">Ваше имя</label>
                    </div>
                    <div className="order__phone order__input">
                        <InputMask
                            className="input-default"
                            mask="+9 (999) 999-99-99" 
                            value={inputs[1]}
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                            name='1'
                            required
                            id='phone'
                        />
                        <label className="input-label" htmlFor="phone">Номер телефона</label>
                    </div>
                    <div className="order__comment order__input">
                        <input 
                            type="text" 
                            required
                            className="input-default"
                            value={inputs[2]} 
                            name='2' 
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                            id='comment'
                        />
                        <label className="input-label" htmlFor="comment">Комментарий</label>
                    </div>
                    <div className='order__error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</div>
                    <motion.button
                        className="market__item-btn order__btn"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.9 }}
                        style={{backgroundColor: '#c6abffa4'}}
                        onClick={onSendMessage}
                    >{loading ? <span className="loader"></span> : 'Отправить'}</motion.button>
                </div>
            </div>
        </div>
        </>
    )
}

export default SendMessage;