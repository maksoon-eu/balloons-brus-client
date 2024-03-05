import { useState, useContext, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useClickOut } from "../../hooks/clickOut.hook";
import { Context } from "../..";
import { motion } from "framer-motion";
import { createReview } from "../../http/reviewApi";
import { createWork } from "../../http/workApi";
import { changeWork } from "../../http/workApi";
import { changeReviews } from "../../http/reviewApi";

import ChooseImg from "../chooseImg/ChooseImg";

import "./infoModal.scss";

const InfoModal = observer(({changeModal, setChangeModal, showAnimation, setShowAnimation, store, changeImg, setChangeImg, activeItem}) => {
    const [imgFile, setImgFile] = useState();
    const [inputError, setInputError] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0);

    const refChange = useRef(null);

    const item = useContext(Context);

    if (changeImg) {
        useClickOut(refChange, changeModal, false, false, true, setShowAnimation, setRotationAngle, setChangeImg)
    } else {
        useClickOut(refChange, changeModal, false, false, true, setShowAnimation, setRotationAngle, setChangeModal)
    }

    const onSubmit = () => {
        if (changeImg && (imgFile || rotationAngle)) {
            const formData = new FormData()
            formData.append('img', imgFile)

            if (store === 'reviews') {
                item.reviews.setReviewsLoading(true)
                changeReviews(activeItem.id, formData, rotationAngle)
                    .then(data => {
                        setShowAnimation(false)
                        setTimeout(() => {
                            setChangeModal(false)
                            setRotationAngle(0)
                            setChangeImg(false)
                        }, 400)
                        setInputError(false)

                        item.reviews.setUpdateReviews(true)
                        item.reviews.setReviewsLoading(false)
                    })
                    .catch(e => {
                        setInputError('Ошибка сервера')
                    })
            } else {
                item.reviews.setReviewsLoading(true)

                changeWork(activeItem.id, formData, rotationAngle)
                    .then(data => {
                        setShowAnimation(false)
                        setTimeout(() => {
                            setChangeModal(false)
                            setRotationAngle(0)
                            setChangeImg(false)
                        }, 400)
                        setInputError(false)

                        item.works.setUpdateWorks(true)
                        item.reviews.setReviewsLoading(false)
                        
                    })
                    .catch(e => {
                        setInputError('Ошибка сервера')
                    })
            }
        } else {
            if (!imgFile) {
                setInputError('Заполните все поля')
            } else if (item[store][store].length >= 16) {
                setInputError('Нельзя добавить больше 16')
            } else {
                setInputError(false)

                const formData = new FormData()
                formData.append('img', imgFile)

                if (store === 'reviews') {
                    item.reviews.setReviewsLoading(true)
                    createReview(formData, rotationAngle)
                        .then(data => {
                            setShowAnimation(false)
                            setTimeout(() => {
                                setChangeModal(false)
                                setChangeImg(false)
                            }, 400)
                            setImgFile()
                            document.querySelector('.input-label').style.transform = 'translateY(0) translateX(-50%) scale(1)'
                            item.reviews.setReviewsLoading(false)
                            item.reviews.setUpdateReviews(true)
                        })
                        .catch(e => {
                            item.reviews.setReviewsLoading(false)
                            setInputError('Ошибка сервера')
                        })
                } else {
                    item.works.setWorksLoading(true)
                    createWork(formData, rotationAngle)
                        .then(data => {
                            setShowAnimation(false)
                            setTimeout(() => {
                                setChangeModal(false)
                                setChangeImg(false)
                            }, 400)
                            setImgFile()
                            document.querySelector('.input-label').style.transform = 'translateY(0) translateX(-50%) scale(1)'
                            item.works.setWorksLoading(false)
                            item.works.setUpdateWorks(true)
                        })
                        .catch(e => {
                            item.works.setWorksLoading(false)
                            setInputError('Ошибка сервера')
                        })
                }
            }
        }
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
                <ChooseImg
                    rotationAngle={rotationAngle}
                    setRotationAngle={setRotationAngle}
                    setImgFile={setImgFile}
                    setInputError={setInputError}
                    itemId={"img"}
                    itemImg={activeItem.img}
                    classNames={"create__modal-img"}
                    changeImg={changeImg}
                />
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{item[store][`${store}Loading`] ? <span className="loader"></span> : changeImg ? 'Изменить' : "Создать"}</motion.div>
            </div>
        </motion.div>
    )
})

export default InfoModal;