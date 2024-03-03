import React, { useState, useContext, useEffect, useRef } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { sendOrder } from '../../http/orderApi';
import { fetchIdsItem } from '../../http/itemsApi';
import { addToCart } from '../../helpers/Helpers';
import InputMask from 'react-input-mask';
import DatePicker from "react-widgets/DatePicker";
import { DropdownList } from 'react-widgets';
import moment from 'moment';
import Localization from 'react-widgets/esm/Localization';
import { useInputsChange } from '../../hooks/inputs.hook';

import ThanksModal from '../thanksModal/ThanksModal';
import TextInput from '../textInput/TextInput';

import 'moment/locale/ru';

import './orderModal.scss';
import "react-widgets/scss/styles.scss";

const OrderModal = observer(() => {
    const [inputs, setInputs] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [inputError, setInputError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [showAnimationOrder, setShowAnimationOrder] = useState(false);
    const [showAnimationCheck, setShowAnimationCheck] = useState(false);
    const [openVerification, setOpenVerification] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const refModalOrder = useRef(null);
    const refModalCheck = useRef(null);

    const {items} = useContext(Context);
    
    useEffect(() => {
        if (!items.cartLoading) {
            removeItem(items.cartItems)
        }
    }, [items.cartItems, items.cartLoading])

    const removeItem = (data) => {
        if (data.length === 0) {
            localStorage.removeItem('cart')
            items.setCart([])
        } else {
            const availableItems = data.filter(item => item.available)
            if (availableItems.length !== items.cart.length) {
                const firstIds = availableItems.map(item => item.id);
                const secondIds = items.cart.map(item => item[0]);
                let i = 0;
                for (let itemId of secondIds) {
                    if (!firstIds.includes(itemId)) {
                        addToCart(itemId, true, items.cart[i][1], items.cart[i][2], items, true)
                    }
                    i++;
                }
            }
            changePrice(availableItems)
        }
    }

    const changePrice = (data) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === items.cart[i][0] && data[i].price !== items.cart[i][2]) {
                addToCart(data[i].id, data[i].available, items.cart[i][1], data[i].price, items)
            }
        }
    }

    const orderVerification = async () => {
        const itemsCart = items.cart.map(item => item[0]);
        const data = await fetchIdsItem(itemsCart);

        return data
    }

    const checkVerification = (data) => {
        let flag = 0;
        if (data.length === 0) {
            return 'info';
        } else if (data.length !== items.cart.length) {
            return 'info';
        }
        for (let i = 0; i < items.cartItems.length; i++) {
            if (data[i].updatedAt !== items.cartItems[i].updatedAt) {
                flag = 'info';
                break;
            }
        }
        return flag;
    }
    
    const constructOrder = () => {
        moment.locale('ru');
        const formData = new FormData()
        formData.append('products', JSON.stringify(items.cartItems))
        formData.append('quality', JSON.stringify(items.cart))
        formData.append('name', inputs[0])
        formData.append('tel', inputs[1])
        formData.append('address', inputs[2])
        formData.append('date', moment(startDate).format('LL'))
        formData.append('time', startTime)
        formData.append('comment', inputs[3])
        formData.append('price', items.totalPrice)
        sendOrder(formData)
            .then(data => {
                setShowAnimationOrder(true)
                setModalOpen(true)
                setInputs(['', '', '', ''])
                setStartDate(null)
                setStartTime(null)
                items.setCartItems([]);
            })
            .catch(e => {
                console.log(e.message)
            })
    }

    const placeOrder = () => {
        if (!loading) {
            const date = new Date()
            if (inputs[0].length < 2 || inputs[1].includes('_') || inputs[2].length < 2 || !startDate || !startTime) {
                setInputError('Заполните все поля')
            } else if (moment(date).format('LL') === moment(startDate).format('LL') && startTime.slice(0, 2) < date.getHours() + 3) {
                setInputError(`Доставка не раньше ${date.getHours() + 3} часов`)
            } else {
                setLoading(true)
                orderVerification()
                    .then(data => {
                        if (checkVerification(data) === 'info') {
                            setOpenVerification(true)
                            setShowAnimationCheck(true)
                            items.setUpdateCart(true)
                            setLoading(false)
                        } else {
                            constructOrder()
                            setLoading(false)
                        }
                    })
            }
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
        setInputError(false)
    }

    return (
        <React.Fragment>
        {modalOpen && 
            <ThanksModal 
                modalOpen={modalOpen}
                refModal={refModalOrder} 
                setModalOpen={setModalOpen} 
                showAnimation={showAnimationOrder}
                setShowAnimation={setShowAnimationOrder}
                order={true}
            />
        }
        {openVerification && 
            <ThanksModal 
                openModal={openVerification} 
                refModal={refModalCheck} 
                setOpenModal={setOpenVerification}
                showAnimation={showAnimationCheck}
                setShowAnimation={setShowAnimationCheck}
                check={true}
            />
        }
        <div className="order">
            <TextInput 
                value={inputs[0]} 
                onChange={(e) => useInputsChange(e, setInputError, setInputs)} 
                label="Ваше имя" 
                id="name" 
                classNames='order__name order__input'
                name="0"
            />
            <div className="order__phone order__input">
                <InputMask
                    className="input-default"
                    mask="+9 (999) 999-99-99" 
                    value={inputs[1]}
                    onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                    name='1'
                    required
                    id='phone'
                />
                <label className="input-label" htmlFor="phone">Номер телефона</label>
            </div>
            <TextInput 
                value={inputs[2]} 
                onChange={(e) => useInputsChange(e, setInputError, setInputs)} 
                label="Адрес доставки" 
                id="address" 
                classNames='order__name order__input'
                name="2"
            />
            <div className="order__date order__input order__date">
                <Localization
                    messages={{
                        moveToday: "Сегодня",
                        emptyFilter: "Ничего не найдено",
                    }}
                >
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
                    <DropdownList
                        placeholder='Время'
                        onChange={value => setStartTime(value)}
                        data={[
                            "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
                            "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
                            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
                            "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
                            "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
                        ]}
                    />
                </Localization>
            </div>
            <TextInput 
                value={inputs[3]} 
                onChange={(e) => useInputsChange(e, setInputError, setInputs)} 
                label="Комментарий" 
                id="comment" 
                classNames='order__name order__input'
                name="3"
            />
            <div className="order__price">Итоговая стоимость: <span>{`${items.totalPrice} ₽`}</span></div>
            <div className='order__error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</div>
            <motion.button
                className="market__item-btn order__btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.9 }}
                style={{backgroundColor: '#c6abffa4'}}
                onClick={placeOrder}
                disabled={items.cart.length === 0}
            >{loading ? <span className="loader"></span> : 'Оформить'}</motion.button>
        </div>
        </React.Fragment>
    )
})

export default OrderModal;