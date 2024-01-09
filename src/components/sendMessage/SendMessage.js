import { useState, useEffect, useRef } from "react";
import InputMask from 'react-input-mask';
import { motion } from "framer-motion";
import { sendMessage } from "../../http/orderApi";

import close from '../../resources/close.svg'

import './sendMessage.scss';

const InfoModal = ({openModal, setOpenModal}) => {
    const refModal = useRef(null);

    useEffect(() => {
        const clickOutElement = (e) => {
            if (openModal && refModal.current && !refModal.current.contains(e.target)) {
                setOpenModal(false)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [openModal])

    return (
        <motion.div 
            variants={{
                open: {
                    opacity: 1,
                    y: 0,
                    display: 'block'
                },
                closed: {
                    opacity: 0,
                    y: -100,
                    display: 'none',
                    transition: {
                        display: {delay: .4}
                    }
                }
            }}
            initial={{opacity: 0, y: -100}}
            animate={openModal ? "open" : "closed"}
            className="change__modal"
            transition={{duration: .4}}
        >
            <div className="info__modal-inner" ref={refModal}>
                <div className="info__modal-title">Спасибо за обращение!</div>
                <div className="info__modal-text">Скоро с вами свяжется менеджер для уточнения деталей</div>
                <div className="info__modal-close" onClick={() => setOpenModal(false)}>
                    <img src={close} alt="" />
                </div>
            </div>
        </motion.div>
    )
}

const SendMessage = () => {
    const [inputs, setInputs] = useState(['', '', '']);
    const [inputError, setInputError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false)

    const onInputsChange = (e) => {
        setInputError(false)

        if (e.target.value.charAt(0) === ' ') {
            e.target.value = ''
        }

        setInputs(inputs => inputs.map((item, i) => i === +e.target.name ? e.target.value : item))
    }

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
                    setTimeout(() => {
                    setInputs(['', '', ''])
                    setLoading(false)
                    setOpenModal(true)
                    }, 3000)
                })
                .catch(e => {
                    console.log(e.message)
                    setLoading(false)
                })
        }
    }

    return (
        <>
        <InfoModal openModal={openModal} setOpenModal={setOpenModal} />
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
                            onChange={onInputsChange}
                            id='name'
                        />
                        <label className="input-label" htmlFor="name">Ваше имя</label>
                    </div>
                    <div className="order__phone order__input">
                        <InputMask
                            className="input-default"
                            mask="+9 (999) 999-99-99" 
                            value={inputs[1]}
                            onChange={onInputsChange}
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
                            onChange={onInputsChange}
                            id='comment'
                        />
                        <label className="input-label" htmlFor="comment">Комментарий</label>
                    </div>
                    <div className='order__error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</div>
                    <motion.button
                        className="market__item-btn order__btn"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.9 }}
                        style={{backgroundColor: '#c5abff'}}
                        onClick={onSendMessage}
                    >{loading ? <span className="loader"></span> : 'Отправить'}</motion.button>
                </div>
            </div>
        </div>
        </>
    )
}

export default SendMessage;