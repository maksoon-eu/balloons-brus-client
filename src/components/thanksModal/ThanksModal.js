import React from "react";
import { useClickOut } from "../../hooks/clickOut.hook";
import { motion } from "framer-motion";

import close from '../../resources/close.svg'

const ThanksModal = ({modalOpen, setModalOpen, refModal, order = false, change = false, setShowAnimation, showAnimation, confirm}) => {

    useClickOut(refModal, modalOpen, false, false, true, setShowAnimation, false, setModalOpen);

    const closeAnimation = () => {
        setShowAnimation(false)
        setTimeout(() => {
            setModalOpen(false)
        }, 400)
    }

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
            animate={showAnimation ? "open" : "closed"}
            className="change__modal"
            transition={{duration: .4}}
        >
            <div className={`info__modal-inner ${change ? 'info__modal-inner--center' : ''}`} ref={refModal}>
                {confirm ? 
                    <React.Fragment>
                    <div className="info__modal-text">Вы уверены что хотите удалить? Также, безвозвратно удалятся все товары находящиеся внутри</div>
                    <div className="info__modal-confirm">
                        <div className="info__modal-btn">Да</div>
                        <div className="info__modal-btn">Нет</div>
                    </div>
                    </React.Fragment>
                : change ? 
                    <div className="info__modal-text">Товары в вашей корзине были изменены или удалены администратором, проверьте их еще раз перед заказом</div>
                :
                    <React.Fragment>
                    <div className="info__modal-title">{order ? 'Спасибо за заказ!' : 'Спасибо за обращение!'}</div>
                    <div className="info__modal-text">{order ? 'Скоро с вами свяжется менеджер для уточнения деталей заказа и оплаты' : 'Скоро с вами свяжется менеджер для уточнения деталей'}</div>
                    </React.Fragment>
                }
                <div className="info__modal-close" onClick={closeAnimation}>
                    <img src={close} alt="" />
                </div>
            </div>
        </motion.div>
    )
}

export default ThanksModal;