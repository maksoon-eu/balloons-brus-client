import Slider from "react-slick";
import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { createReview, deleteReview, fetchReviews } from "../../http/reviewApi";
import { createWork, deleteWork, fetchWorks } from "../../http/workApi";
import { LazyLoadImage } from "react-lazy-load-image-component";

import SkeletonItem from '../skeleton/SkeletonItem';

import loading from '../../resources/loading.svg';

import './infoSlider.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AddInfoModal = observer(({changeModal, setChangeModal, showAnimation, setShowAnimation, store}) => {
    const [imgFile, setImgFile] = useState();
    const [inputError, setInputError] = useState(false);

    const refChange = useRef(null);
    const refImg = useRef(null);

    const item = useContext(Context);

    useEffect(() => {
        const clickOutElement = (e) => {
            if (changeModal && refChange.current && !refChange.current.contains(e.target)) {
                setShowAnimation(false)
                setTimeout(() => {
                    setChangeModal(false)
                }, 400)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [changeModal])

    const previewFile = (e, inputImg) => {
        const file = e.target.files[0];
        setImgFile(e.target.files[0])
    
        if (file) {
            const reader = new FileReader();
        
            reader.onload = function() {
                inputImg.current.setAttribute("src", reader.result);
            }
        
            reader.readAsDataURL(file);
            inputImg.current.style.opacity = 1;
            document.querySelector('.input-label').style.transform = 'translateY(-965%) translateX(-125%) scale(.7)'
            setInputError(false)
        }
    }

    const onSubmit = () => {
        if (refImg.current.currentSrc === '' ) {
            setInputError('Заполните все поля')
        } else {
            setInputError(false)

            const formData = new FormData()
            formData.append('img', imgFile)

            if (store === 'reviews') {
                item.reviews.setReviewsLoading(true)
                createReview(formData)
                    .then(data => {
                        setShowAnimation(false)
                        setTimeout(() => {
                            setChangeModal(false)
                        }, 400)
                        setImgFile()
                        refImg.current.setAttribute("src", "")
                        refImg.current.style.opacity = 0;
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
                createWork(formData)
                    .then(data => {
                        setShowAnimation(false)
                        setTimeout(() => {
                            setChangeModal(false)
                        }, 400)
                        setImgFile()
                        refImg.current.setAttribute("src", "")
                        refImg.current.style.opacity = 0;
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
                    <img ref={refImg} src="" alt="" className="create__img"/>
                    <input className='input-file' type="file" onInput={(e) => previewFile(e, refImg)} id='img'/>
                    <div className="create__choose">
                        <svg width="30px" height="26px" viewBox="0 0 22 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Rounded" transform="translate(-713.000000, -2903.000000)">
                                    <g id="Image" transform="translate(100.000000, 2626.000000)">
                                        <g id="-Round-/-Image-/-photo_size_select_actual" transform="translate(612.000000, 274.000000)">
                                            <g transform="translate(0.000000, 0.000000)">
                                                <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                                                <path d="M21,3 L3,3 C2,3 1,4 1,5 L1,19 C1,20.1 1.9,21 3,21 L21,21 C22,21 23,20 23,19 L23,5 C23,4 22,3 21,3 Z M5.63,16.19 L8.12,12.99 C8.32,12.74 8.7,12.73 8.9,12.98 L11,15.51 L14.1,11.52 C14.3,11.26 14.7,11.26 14.9,11.53 L18.41,16.21 C18.66,16.54 18.42,17.01 18.01,17.01 L6.02,17.01 C5.61,17 5.37,16.52 5.63,16.19 Z" id="🔹-Icon-Color" fill="#c5abff"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <label className="input-label input-label-img" htmlFor="img">Выберите файл</label>
                </div>
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{item[store][`${store}Loading`] ? "Загрузка..." : "Создать"}</motion.div>
            </div>
        </motion.div>
    )
})

const InfoSlider = observer(({title, store}) => {
    const [changeModal, setChangeModal] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    
    const item = useContext(Context);

    const skeletonArr = ['', '', '', ''];
    let itemList = [];

    useEffect(() => {
        if (store === 'reviews') {
            if (item.reviews.updateReviews || itemList.length === 0) {
                item.reviews.setReviewsLoading(true)
                fetchReviews()
                    .then((data) => {
                        item.reviews.setReviews(data)
                        item.reviews.setReviewsLoading(false)
                        item.reviews.setUpdateReviews(false)
                    })
                    .catch((e) => {
                        item.reviews.setReviewsLoading(false)
                        item.reviews.setUpdateReviews(false)
                    })
            }
        } else {
            if (item.works.updateWorks || itemList.length === 0) {
                item.works.setWorksLoading(true)
                fetchWorks()
                    .then((data) => {
                        item.works.setWorks(data)
                        item.works.setWorksLoading(false)
                        item.works.setUpdateWorks(false)
                    })
                    .catch((e) => {
                        item.works.setWorksLoading(false)
                        item.works.setUpdateWorks(false)
                    })
            }
        }
    }, [item.reviews.updateReviews, item.works.updateWorks])

    const openModal = () => {
        if (store === 'reviews') {
            if (!item.reviews.reviewsLoading) {
                setChangeModal(true)
                setShowAnimation(true)
            }
        } else {
            if (!item.works.worksLoading) {
                setChangeModal(true)
                setShowAnimation(true)
            }
        }
    }

    const deleteItem = (id) => {
        if (store === 'reviews') {
            deleteReview(id)
                .then(data => {
                    item.reviews.setUpdateReviews(true)
                })
        } else {
            deleteWork(id)
                .then(data => {
                    item.works.setUpdateWorks(true)
                })
        }
    }

    itemList = item[store][store].map(el => {
        return (
            <div key={el.id} className="info">
                <div className="info__inner">
                    {item.user.isAuth && 
                        <div className="market__item-icons">
                            <div className="market__item-icon market__item-icon--trash" onClick={() => deleteItem(el.id)}>
                                <svg width="20" height="20" viewBox="0 0 39 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.6618 11H1.6023C1.17734 11 0.769815 10.842 0.469326 10.5607C0.168836 10.2794 0 9.89785 0 9.50003C0 9.1022 0.168836 8.72067 0.469326 8.43936C0.769815 8.15806 1.17734 8.00003 1.6023 8.00003H11V5.32424C11 3.91218 11.5567 2.55796 12.5478 1.55948C13.5388 0.560998 14.8829 5.24888e-05 16.2844 5.24888e-05H22.6989C23.3943 -0.00215064 24.0832 0.133941 24.7263 0.40052C25.3693 0.667099 25.9539 1.05892 26.4463 1.55354C26.9388 2.04815 27.3295 2.63584 27.5961 3.28289C27.8627 3.92994 28 4.62365 28 5.32424V8.00003H37.3977C37.8227 8.00003 38.2302 8.15806 38.5307 8.43936C38.8312 8.72067 39 9.1022 39 9.50003C39 9.89785 38.8312 10.2794 38.5307 10.5607C38.2302 10.842 37.8227 11 37.3977 11H26.3382H12.6618ZM24.6765 7.65148H14.3235V5.32424C14.3235 4.80027 14.5302 4.29776 14.8979 3.92726C15.2657 3.55676 15.7644 3.3486 16.2844 3.3486H22.6989C22.9578 3.34639 23.2145 3.39586 23.4544 3.49415C23.6942 3.59245 23.9123 3.73762 24.0962 3.92129C24.28 4.10497 24.426 4.32352 24.5255 4.56431C24.6251 4.8051 24.6765 5.06338 24.6765 5.32424V7.65148ZM27.1557 43.9999H11.8764C10.7009 44.0086 9.56337 43.5743 8.68088 42.7799C7.79838 41.9855 7.23264 40.8866 7.09161 39.6929L4.01342 15.8573C3.95843 15.4246 4.07376 14.9873 4.33399 14.6416C4.59421 14.2958 4.978 14.07 5.401 14.0138C5.824 13.9575 6.25151 14.0755 6.5895 14.3416C6.92748 14.6078 7.14827 15.0004 7.20326 15.4331L10.2495 39.2034C10.2892 39.6072 10.4746 39.9814 10.7695 40.2529C11.0645 40.5244 11.4477 40.6738 11.8444 40.6717H27.1238C27.5205 40.6738 27.9039 40.5244 28.1988 40.2529C28.4937 39.9814 28.679 39.6072 28.7187 39.2034L31.8288 15.4331C31.8844 15.005 32.1036 14.617 32.4385 14.354C32.7733 14.091 33.1965 13.9745 33.6151 14.0301C34.0336 14.0869 34.413 14.3112 34.6702 14.6537C34.9273 14.9962 35.0411 15.4291 34.9867 15.8573L31.9085 39.6929C31.7681 40.881 31.207 41.9754 30.3312 42.7691C29.4555 43.5627 28.3257 44.0006 27.1557 43.9999ZM24.352 24H13.6317C13.1989 24 12.7839 23.842 12.4779 23.5607C12.1719 23.2794 12 22.8979 12 22.5C12 22.1022 12.1719 21.7207 12.4779 21.4394C12.7839 21.1581 13.1989 21 13.6317 21H24.3683C24.8011 21 25.2161 21.1581 25.5221 21.4394C25.8281 21.7207 26 22.1022 26 22.5C26 22.8979 25.8281 23.2794 25.5221 23.5607C25.2161 23.842 24.8011 24 24.3683 24H24.352ZM16.6823 33H22.3177C22.7639 33 23.1918 32.7893 23.5073 32.4142C23.8227 32.0392 24 31.5305 24 31C24 30.4696 23.8227 29.9609 23.5073 29.5858C23.1918 29.2107 22.7639 29 22.3177 29H16.6823C16.2361 29 15.8081 29.2107 15.4926 29.5858C15.1772 29.9609 15 30.4696 15 31C15 31.5305 15.1772 32.0392 15.4926 32.4142C15.8081 32.7893 16.2361 33 16.6823 33Z" fill="#8D59FE"/>
                                </svg>
                            </div>
                        </div>
                    }
                    <div className="info__item">
                        <LazyLoadImage 
                            width='100%' height='100%'
                            placeholderSrc={loading}
                            effect="opacity"
                            src={`http://localhost:4000/${el.img}`}
                            crossOrigin="anonymous"
                            alt='img'
                        />
                    </div>
                </div>
            </div>
        )
    })

    const skeletonList = skeletonArr.map((item, i) => {
        return (
            <div key={i} className="skeleton__item-slider">
                <SkeletonItem/>
            </div>
        )
    })

    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 4,
        swipeToSlide: true,
        slidesToScroll: 1,
        responsive: [
            {
              breakpoint: 950,
              settings: {
                slidesToShow: 3
              }
            },
            {
                breakpoint: 730,
                settings: {
                  slidesToShow: 2
                }
              }
        ]
    };

    return (
        <>
        {changeModal && <AddInfoModal changeModal={showAnimation} setChangeModal={setChangeModal} showAnimation={showAnimation} setShowAnimation={setShowAnimation} store={store} />}
        <div className="slider">
            <div className="slider__title">{item[store][`${store}Loading`] ? 'Загрузка...' : title}</div>

            {item.user.isAuth && <div className="slider__btn">
                <motion.div
                    className="info__btn"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={openModal}
                >Добавить</motion.div>
            </div>}
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={item[store][`${store}Loading`]}
                >
                    <Slider {...settings}>
                        {item[store][`${store}Loading`] ? skeletonList : !item[store][`${store}Loading`] && itemList.length === 0 ? <span className="nothing__found">Ничего не найдено</span> : itemList}
                    </Slider>
                </motion.div>
            </AnimatePresence>
        </div>
        </>
    );
})

export default InfoSlider;