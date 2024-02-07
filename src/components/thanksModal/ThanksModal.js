import React, { useRef } from "react";
import { useClickOut } from "../../hooks/clickOut.hook";
import { motion } from "framer-motion";

import close from '../../resources/close.svg'

const ThanksModal = ({openModal, setOpenModal, message = false, order = false, change = false}) => {
    const refModal = useRef(null);

    useClickOut(refModal, openModal, setOpenModal)

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
            <div className={`info__modal-inner ${change ? 'info__modal-inner--center' : ''}`} ref={refModal}>
                {change ? 
                    <div className="info__modal-text">Товары в вашей корзине были изменены или удалены администратором, проверьте их еще раз перед заказом</div>
                :
                    <>
                    <div className="info__modal-title">{order ? 'Спасибо за заказ!' : 'Спасибо за обращение!'}</div>
                    <div className="info__modal-text">{order ? 'Скоро с вами свяжется менеджер для уточнения деталей заказа и оплаты' : 'Скоро с вами свяжется менеджер для уточнения деталей'}</div>
                    </>
                }
                <div className="info__modal-close" onClick={() => setOpenModal(false)}>
                    <img src={close} alt="" />
                </div>
            </div>
        </motion.div>
    )
}

export default ThanksModal;