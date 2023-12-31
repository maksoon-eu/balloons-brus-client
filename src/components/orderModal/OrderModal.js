import { useState, useContext, useEffect, useRef } from 'react';
import { Context } from '../..';
import InputMask from 'react-input-mask';
import DatePicker from "react-widgets/DatePicker";
import TimeInput from "react-widgets/TimeInput";
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import moment from 'moment';
import 'moment/locale/ru';
import { sendOrder } from '../../http/orderApi';

import './orderModal.scss';
import "react-widgets/scss/styles.scss";

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
                <div className="info__modal-title">Спасибо за заказ!</div>
                <div className="info__modal-text">Скоро с вами свяжется менеджер для уточнения деталей заказа и оплаты</div>
            </div>
        </motion.div>
    )
}

const OrderModal = observer(() => {
    const [inputs, setInputs] = useState(['', '', '', '']);
    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [price, setPrice] = useState(0);
    const [inputError, setInputError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const {items} = useContext(Context);

    useEffect(() => {
        let totalPrice = 0;
        items.cart.forEach(item => {
            totalPrice += item[2] * item[1]
        })
        setPrice(totalPrice)
    }, [items.cart])

    const onInputsChange = (e) => {
        setInputError(false)

        if (e.target.value.charAt(0) === ' ') {
            e.target.value = ''
        }

        setInputs(inputs => inputs.map((item, i) => i === +e.target.name ? e.target.value : item))
    }

    const placeOrder = () => {
        if (inputs[0].length < 2 || inputs[1].includes('_') || inputs[2].length < 2 || !startDate || !startTime) {
            setInputError(true)
        } else {
            moment.locale('ru');
            const formData = new FormData()
            formData.append('products', JSON.stringify(items.cartItems))
            formData.append('quality', JSON.stringify(items.cart))
            formData.append('name', inputs[0])
            formData.append('tel', inputs[1])
            formData.append('address', inputs[2])
            formData.append('date', moment(startDate).format('LL'))
            formData.append('time', moment(startTime).format('LT'))
            formData.append('comment', inputs[3])
            formData.append('price', price)
            sendOrder(formData)
                .then(data => {
                    setOpenModal(true)
                    setTimeout(() => {
                        setOpenModal(false)
                    }, 4000)
                })
                .catch(e => {
                    console.log(e.message)
                })
        }
    }

    const forbidKeyDown = (e) => {
        e.preventDefault()
    }

    const changeCalendarOpen = () => {
        if (!isCalendarOpen) {
            setIsCalendarOpen(true)
        }
    }
    
    const toggleCalendar = (isOpen) => {
        setIsCalendarOpen(isOpen)
    }

    const changeDate = value => {
        setStartDate(value)
        setIsCalendarOpen(false)
    }

    return (
        <>
        <InfoModal openModal={openModal} setOpenModal={setOpenModal} />
        <div className="order">
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
            <div className="order__address order__input">
                <input
                    className="input-default"
                    value={inputs[2]} 
                    name='2' 
                    onChange={onInputsChange}
                    id='address'
                    type='text'
                    required
                />
                <label className="input-label" htmlFor="address">Адрес доставки</label>
            </div>
            <div className="order__date order__input order__date">
                <DatePicker
                    placeholder='Выберите дату'
                    value={startDate}
                    onChange={changeDate}
                    min={new Date()}
                    className="w-3/5"
                    onKeyDown={forbidKeyDown}
                    onClick={changeCalendarOpen}
                    onToggle={toggleCalendar}
                    open={isCalendarOpen}
                    valueFormat={{ dateStyle: "medium" }}
                />
                <TimeInput
                    value={startTime}
                    onChange={value => setStartTime(value)}
                    className="w-3/5"
                />
            </div>
            <div className="order__comment order__input">
                <input 
                    type="text" 
                    required
                    className="input-default"
                    value={inputs[3]} 
                    name='3' 
                    onChange={onInputsChange}
                    id='comment'
                />
                <label className="input-label" htmlFor="comment">Комментарий</label>
            </div>
            <div className="order__price">Итоговая стоимость: <span>{`${price} ₽`}</span></div>
            <div className='order__error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>Заполните все поля</div>
            <motion.button
                className="market__item-btn order__btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.9 }}
                style={{backgroundColor: '#c5abff'}}
                onClick={placeOrder}
                disabled={items.cart.length === 0}
            >Оформить</motion.button>
        </div>
        </>
    )
})

export default OrderModal;