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
import { fetchIdsItem } from '../../http/itemsApi';
import { addToCart } from '../../helpers/Helpers';

import close from '../../resources/close.svg'

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
                <div className="info__modal-close" onClick={() => setOpenModal(false)}>
                    <img src={close} alt="" />
                </div>
            </div>
        </motion.div>
    )
}

const VerificationModal = ({openModal, setOpenModal}) => {
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
            <div className="info__modal-inner info__modal-inner--center" ref={refModal}>
                <div className="info__modal-text">Товары в вашей корзине были изменены, проверьте их еще раз перед заказом</div>
                <div className="info__modal-close" onClick={() => setOpenModal(false)}>
                    <img src={close} alt="" />
                </div>
            </div>
        </motion.div>
    )
}

const AvailableModal = ({openModal, setOpenModal, setClientAnswer}) => {
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
                <div className="info__modal-text">Некоторых товаров в вашей корзине нет в наличии, хотите продолжить заказ?</div>
                <div className="info__modal-btns">
                    <motion.div 
                        className="info__modal-btn"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setOpenModal(false)}
                    >Нет</motion.div>
                    <motion.div 
                        className="info__modal-btn"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setClientAnswer(true)}
                    >Да</motion.div>
                </div>
                <div className="info__modal-close" onClick={() => setOpenModal(false)}>
                    <img src={close} alt="" />
                </div>
            </div>
        </motion.div>
    )
}

const NotAvailableModal = ({openModal, setOpenModal}) => {
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
            <div className="info__modal-inner  info__modal-inner--center" ref={refModal}>
                <div className="info__modal-text">Всех товаров в вашей корзине нет в наличии</div>
                <div className="info__modal-close" onClick={() => setOpenModal(false)}>
                    <img src={close} alt="" />
                </div>
            </div>
        </motion.div>
    )
}

const OrderModal = observer(() => {
    const [inputs, setInputs] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [price, setPrice] = useState(0);
    const [inputError, setInputError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openVerification, setOpenVerification] = useState(false);
    const [openAvailable, setOpenAvailable] = useState(false);
    const [openNotAvailable, setOpenNotAvailable] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [clientAnswer, setClientAnswer] = useState(false);

    const {items} = useContext(Context);

    useEffect(() => {
        let totalPrice = 0;
        items.cart.forEach(item => {
            totalPrice += item[2] * item[1]
        })
        setPrice(totalPrice)
    }, [items.cart])

    useEffect(() => {
        if (clientAnswer) {
            constructOrder()
        }
    }, [clientAnswer])

    useEffect(() => {
        if (!items.cartLoading) {
            if (items.cartItems.length === 0) {
                localStorage.removeItem('cart')
                items.setCart([])
            } else if (items.cartItems.length !== items.cart.length) {
                const firstIds = items.cartItems.map(item => item.id);
                const secondIds = items.cart.map(item => item[0]);
                let i = 0;
                for (let itemId of secondIds) {
                    if (!firstIds.includes(itemId)) {
                        addToCart(itemId, true, items.cart[i][1], items.cart[i][2], items, true)
                    }
                    i++;
                }
            }
        }
    }, [items.cartItems, items.cartLoading])

    const onInputsChange = (e) => {
        setInputError(false)

        if (e.target.value.charAt(0) === ' ') {
            e.target.value = ''
        }

        setInputs(inputs => inputs.map((item, i) => i === +e.target.name ? e.target.value : item))
    }

    const orderVerification = async () => {
        const itemsCart = items.cart.map(item => item[0]);
        const data = await fetchIdsItem(itemsCart);

        return data
    }

    const checkVerification = (data) => {
        let flag = 0;
        if (data.length === 0) {
            localStorage.removeItem('cart')
            items.setCart([])
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

    const checkAvailable = () => {
        let count = 0;
        items.cartItems.forEach(item => {
            if (!item.available) {
                count++
            }
        })

        const cartLength = items.cartItems.length;
        if (count === cartLength) {
            return 'all'
        } else if (count > 0 && count < cartLength) {
            return 'notAll'
        }
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
        formData.append('time', moment(startTime).format('LT'))
        formData.append('comment', inputs[3])
        formData.append('price', price)
        sendOrder(formData)
            .then(data => {
                setOpenModal(true)
                setInputs(['', '', '', ''])
                setStartDate(null)
                setStartTime(null)
                setClientAnswer(false)
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
            } else if (date === startDate && startTime.getHours() < date.getHours() + 3) {
                setInputError(`Доставка не раньше ${date.getHours() + 3} часов`)
            } else {
                setLoading(true)
                orderVerification()
                    .then(data => {
                        setTimeout(() => {
                        if (checkVerification(data) === 'info') {
                            setOpenVerification(true)
                            items.setUpdateCart(true)
                            setLoading(false)
                        } else if (checkAvailable() === 'notAll') {
                            setOpenAvailable(true)
                            setLoading(false)
                        } else if (checkAvailable() === 'all') {
                            setOpenNotAvailable(true)
                            setLoading(false)
                        } else {
                            constructOrder()
                            setLoading(false)
                        }
                    }, 3000)
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
        <>
        <InfoModal openModal={openModal} setOpenModal={setOpenModal} />
        <VerificationModal openModal={openVerification} setOpenModal={setOpenVerification} />
        <AvailableModal openModal={openAvailable} setOpenModal={setOpenAvailable} setClientAnswer={setClientAnswer} />
        <NotAvailableModal openModal={openNotAvailable} setOpenModal={setOpenNotAvailable} />
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
                    onChange={value => {setStartTime(value); setInputError(false)}}
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
            <div className='order__error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</div>
            <motion.button
                className="market__item-btn order__btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.9 }}
                style={{backgroundColor: '#c5abff'}}
                onClick={placeOrder}
                disabled={items.cart.length === 0}
            >{loading ? <span className="loader"></span> : 'Оформить'}</motion.button>
        </div>
        </>
    )
})

export default OrderModal;