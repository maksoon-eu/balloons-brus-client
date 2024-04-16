import "./scaleModal.scss";

import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { useClickOut } from "../../hooks/clickOut.hook";
import { motion } from "framer-motion";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import loadingImg from '../../resources/loading.svg';
import close from '../../resources/close.svg'

const ScaleModal = observer(({changeModal, setChangeModal, showAnimation, setShowAnimation, activeItem}) => {

    const refChange = useRef(null);

    useClickOut(refChange, changeModal, false, false, true, setShowAnimation, false, setChangeModal)

    const closeAnimation = () => {
        setShowAnimation(false)
        setTimeout(() => {
            setChangeModal(false)
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
            <div className="change__modal-content change__modal-content--min" ref={refChange}>
                <LazyLoadImage
                    width='100%' height='100%'
                    placeholderSrc={loadingImg}
                    effect="blur"
                    src={`${process.env.REACT_APP_STORAGE_URL}${activeItem}`}
                    alt='img'
                    className="scale__img"
                />  
                <div className="info__modal-close" onClick={closeAnimation}>
                    <img src={close} alt="" />
                </div>
            </div>
        </motion.div>
    )
})

export default ScaleModal;