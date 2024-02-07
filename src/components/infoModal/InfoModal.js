import { useState, useContext, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useClickOut } from "../../hooks/clickOut.hook";
import { useUploadImg } from "../../hooks/uploadImg.hook";
import { Context } from "../..";
import { motion } from "framer-motion";
import { createReview } from "../../http/reviewApi";
import { createWork } from "../../http/workApi";
import { changeWork } from "../../http/workApi";
import { changeReviews } from "../../http/reviewApi";
import { LazyLoadImage } from "react-lazy-load-image-component";

import loadingImg from '../../resources/loading.svg';

const InfoModal = observer(({changeModal, setChangeModal, showAnimation, setShowAnimation, store, changeImg, setChangeImg, activeItem}) => {
    const [imgFile, setImgFile] = useState();
    const [inputError, setInputError] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [userImageSrc, setUserImageSrc] = useState(false);

    const refChange = useRef(null);
    const refImg = useRef(null);

    const item = useContext(Context);

    if (changeImg) {
        useClickOut(refChange, changeModal, false, false, true, setShowAnimation, setRotationAngle, setChangeImg)
    } else {
        useClickOut(refChange, changeModal, false, false, true, setShowAnimation, setRotationAngle, setChangeModal)
    }

    const onRotate = () => {
        const newRotationAngle = rotationAngle + 90;
        setRotationAngle(newRotationAngle === 360 ? 0 : newRotationAngle);
    };

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
                            setUserImageSrc()
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
                            setUserImageSrc()
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
                <div className="create__modal-img" onClick={() => document.querySelector('.input-file').click()}>
                    {changeImg ? 
                        <LazyLoadImage
                            key={userImageSrc}
                            width='100%' height='100%'
                            placeholderSrc={loadingImg}
                            effect="blur"
                            src={userImageSrc || `https://s3.timeweb.com/9f5e65b7-7ed3bc97-902a-48e4-b04a-3554ca39493b/${activeItem.img}`}
                            alt='img'
                            className="create__img create__img--opacity"
                            style={{ transform: `rotate(${rotationAngle}deg)` }}
                        />
                    : 
                        <img ref={refImg} src={`${userImageSrc ? userImageSrc : ''}`} alt="" className="create__img" style={{ transform: `rotate(${rotationAngle}deg)` }}/>
                    }
                    <input 
                        className='input-file' 
                        type="file" 
                        onInput={(e) => useUploadImg(e, refImg, setImgFile, setInputError, false, setUserImageSrc, !changeImg)} 
                        id='img'
                    />
                    <div className="create__choose">
                        <svg width="30px" height="26px" viewBox="0 0 22 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Rounded" transform="translate(-713.000000, -2903.000000)">
                                    <g id="Image" transform="translate(100.000000, 2626.000000)">
                                        <g id="-Round-/-Image-/-photo_size_select_actual" transform="translate(612.000000, 274.000000)">
                                            <g transform="translate(0.000000, 0.000000)">
                                                <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                                                <path d="M21,3 L3,3 C2,3 1,4 1,5 L1,19 C1,20.1 1.9,21 3,21 L21,21 C22,21 23,20 23,19 L23,5 C23,4 22,3 21,3 Z M5.63,16.19 L8.12,12.99 C8.32,12.74 8.7,12.73 8.9,12.98 L11,15.51 L14.1,11.52 C14.3,11.26 14.7,11.26 14.9,11.53 L18.41,16.21 C18.66,16.54 18.42,17.01 18.01,17.01 L6.02,17.01 C5.61,17 5.37,16.52 5.63,16.19 Z" id="🔹-Icon-Color" fill="#c6abffa4"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <label className="input-label input-label-img" htmlFor="img">Выберите файл</label>
                </div>
                <motion.div 
                    className="change__modal-rotate"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onRotate}
                >Вращать изображение</motion.div>
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