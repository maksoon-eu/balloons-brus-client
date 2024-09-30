import { useState, useRef } from 'react';
import InputMask from 'react-input-mask';
import { motion } from 'framer-motion';
import { sendMessage } from '../../http/orderApi';
import { useInputsChange } from '../../hooks/inputs.hook';

import ThanksModal from '../thanksModal/ThanksModal';
import TextInput from '../textInput/TextInput';

import promo from '../../resources/promo.svg';

import '../orderModal/orderModal.scss';
import './sendMessage.scss';

const SendMessage = () => {
    const [inputs, setInputs] = useState(['', '', '']);
    const [inputError, setInputError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    const refModal = useRef(null);

    const onSendMessage = () => {
        if (inputs[0].length < 2 || inputs[1].includes('_') || inputs[2].length < 2) {
            setInputError('Заполните все поля');
        } else {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', inputs[0]);
            formData.append('tel', inputs[1]);
            formData.append('comment', inputs[2]);
            sendMessage(formData)
                .then((data) => {
                    setInputs(['', '', '']);
                    setLoading(false);
                    setShowAnimation(true);
                    setModalOpen(true);
                })
                .catch((e) => {
                    console.error(e);
                    setLoading(false);
                });
        }
    };

    return (
        <>
            {modalOpen && (
                <ThanksModal
                    modalOpen={modalOpen}
                    refModal={refModal}
                    setModalOpen={setModalOpen}
                    showAnimation={showAnimation}
                    setShowAnimation={setShowAnimation}
                />
            )}
            <div className="message">
                <div className="message__inner">
                    <div className="message__inner-title">Не нашли подходящий вариант?</div>
                    <div className="message__inner-text">
                        оставьте ваши контакты и мы подберем под вас уникальную композицию
                    </div>
                    <div className="message__inner-order">
                        <TextInput
                            value={inputs[0]}
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                            label="Ваше имя"
                            id="name"
                            classNames="order__name order__input"
                            name="0"
                        />
                        <div className="order__phone order__input">
                            <InputMask
                                className="input-default"
                                mask="+9 (999) 999-99-99"
                                value={inputs[1]}
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                                name="1"
                                required
                                id="phone"
                            />
                            <label className="input-label" htmlFor="phone">
                                Номер телефона
                            </label>
                        </div>
                        <TextInput
                            value={inputs[2]}
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                            label="Комментарий"
                            id="comment"
                            classNames="order__comment order__input"
                            name="2"
                        />
                        <div
                            className="order__error"
                            style={{ color: inputError ? '#E84D4D' : 'transparent' }}>
                            {inputError}
                        </div>
                        <motion.button
                            className="market__item-btn order__btn"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ backgroundColor: '#c6abffa4' }}
                            onClick={onSendMessage}>
                            {loading ? <span className="loader"></span> : 'Отправить'}
                        </motion.button>
                    </div>
                </div>
                <div className="message__img">
                    <img src={promo} alt="" />
                </div>
            </div>
        </>
    );
};

export default SendMessage;
