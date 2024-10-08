import Slider from 'react-slick';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { deleteReview, fetchReviews } from '../../http/reviewApi';
import { deleteWork, fetchWorks } from '../../http/workApi';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import InfoModal from '../infoModal/InfoModal';
import SkeletonItem from '../skeleton/SkeletonItem';
import ScaleModal from '../scaleModal/ScaleModal';

import loadingImg from '../../resources/loading.svg';

import './infoSlider.scss';

const InfoSlider = observer(({ title, store, refs }) => {
    const [changeModal, setChangeModal] = useState(false);
    const [changeImg, setChangeImg] = useState(false);
    const [openScale, setOpenScale] = useState(false);
    const [showAnimationInfo, setShowAnimationInfo] = useState(false);
    const [showAnimationScale, setShowAnimationScale] = useState(false);
    const [activeItem, setActiveItem] = useState({});
    const [activeScale, setActiveScale] = useState();

    const item = useContext(Context);

    const skeletonArr = ['', '', '', ''];
    let itemList = [];

    useEffect(() => {
        if (store === 'reviews') {
            if (item.reviews.updateReviews || itemList.length === 0) {
                item.reviews.setReviewsLoading(true);
                const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1000));

                const fetchDataPromise = fetchReviews()
                    .then((data) => {
                        item.reviews.setReviews(data);
                    })
                    .catch((e) => {
                        console.error(e);
                    });

                Promise.all([fetchDataPromise, timeoutPromise]).finally(() => {
                    item.reviews.setReviewsLoading(false);
                    item.reviews.setUpdateReviews(false);
                });
            }
        } else {
            if (item.works.updateWorks || itemList.length === 0) {
                item.works.setWorksLoading(true);
                const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1000));

                const fetchDataPromise = fetchWorks()
                    .then((data) => {
                        item.works.setWorks(data);
                    })
                    .catch((e) => {
                        console.error(e);
                    });

                Promise.all([fetchDataPromise, timeoutPromise]).finally(() => {
                    item.works.setWorksLoading(false);
                    item.works.setUpdateWorks(false);
                });
            }
        }
    }, [item.reviews.updateReviews, item.works.updateWorks]);

    const openModal = () => {
        if (store === 'reviews') {
            if (!item.reviews.reviewsLoading) {
                setChangeModal(true);
                setShowAnimationInfo(true);
            }
        } else {
            if (!item.works.worksLoading) {
                setChangeModal(true);
                setShowAnimationInfo(true);
            }
        }
    };

    const deleteItem = (id) => {
        if (store === 'reviews') {
            deleteReview(id).then((data) => {
                item.reviews.setUpdateReviews(true);
            });
        } else {
            deleteWork(id).then((data) => {
                item.works.setUpdateWorks(true);
            });
        }
    };

    const onChangeModal = (el) => {
        setChangeImg(true);
        setActiveItem(el);
    };

    const onOpenScale = (item) => {
        setOpenScale(true);
        setShowAnimationScale(true);
        setActiveScale(item);
    };

    itemList = item[store][store].map((el) => {
        return (
            <div key={el.id} className="info" onClick={() => onOpenScale(el.img)}>
                <div className="info__inner">
                    {item.user.isAuth && (
                        <div className="market__item-icons">
                            <div
                                className="market__item-icon"
                                onClick={() => {
                                    onChangeModal(el);
                                    openModal();
                                }}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 41 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.7108 37.999H7.20161C6.64985 37.999 6.10354 37.8881 5.59378 37.6725C5.08402 37.457 4.6207 37.1411 4.23054 36.7428C3.84039 36.3446 3.53093 35.8718 3.31978 35.3514C3.10863 34.8311 3 34.2734 3 33.7101V25.7822C2.99954 24.6727 3.42187 23.6065 4.1777 22.8092L19.2768 6.75423C19.3038 6.7121 19.3328 6.67118 19.3634 6.6316C19.4601 6.50687 19.5729 6.39731 19.6984 6.30592L23.2758 2.50203C24.0168 1.71298 24.9061 1.08469 25.8906 0.654805C26.875 0.224915 27.9344 0.00230141 29.0052 0.000225502C30.0467 -0.00546473 31.0789 0.201424 32.0409 0.608747C33.003 1.01607 33.8755 1.6156 34.6073 2.37209L36.6923 4.48402C37.4284 5.23402 38.0112 6.12564 38.4074 7.10724C38.8035 8.08885 39.0049 9.14094 38.9999 10.2026V10.6899C39.0049 11.7515 38.8035 12.8036 38.4074 13.7852C38.0112 14.7668 37.4284 15.6584 36.6923 16.4084L33.9943 19.1625C33.9997 19.2291 34.0013 19.2962 33.999 19.3637C33.984 19.8132 33.7987 20.2379 33.484 20.5446C33.1693 20.8513 32.7508 21.0148 32.3208 20.9991L32.3045 20.9821H32.2117L16.7666 36.7481C16.3665 37.1566 15.8895 37.4781 15.3643 37.6931C14.8391 37.9081 14.2765 38.0122 13.7108 37.999ZM28.4528 20.12L14.3634 34.3762C14.174 34.5717 13.9166 34.6827 13.6473 34.6849H7.13788C7.00412 34.6849 6.87174 34.658 6.74817 34.6057C6.62459 34.5535 6.51228 34.4769 6.4177 34.3803C6.32312 34.2838 6.248 34.1692 6.19681 34.043C6.14562 33.9169 6.11929 33.7817 6.11929 33.6452V25.7822C6.12294 25.5156 6.22536 25.2602 6.40585 25.0674L19.6262 10.9988C21.189 16.1164 25.045 18.8586 28.4528 20.12ZM31.1404 17.4005L34.3526 14.1503C35.2347 13.2425 35.732 12.0172 35.7372 10.7386V10.2513C35.732 8.97272 35.2347 7.74745 34.3526 6.83967L32.2679 4.71148C31.3863 3.7932 30.1851 3.26769 28.9257 3.24937C28.2864 3.25196 27.6541 3.38559 27.0663 3.64233C26.4785 3.89907 25.9472 4.27366 25.504 4.74396L22.3256 8.12623C23.3012 14.8731 28.6283 16.8438 31.1404 17.4005ZM39.3659 44.0001H1.63412C1.20072 44.0001 0.785103 43.8421 0.478646 43.5608C0.172189 43.2795 0 42.8979 0 42.5001C0 42.1023 0.172189 41.7208 0.478646 41.4395C0.785103 41.1582 1.20072 41.0001 1.63412 41.0001H39.3659C39.7993 41.0001 40.215 41.1582 40.5215 41.4395C40.8279 41.7208 41 42.1023 41 42.5001C41 42.8979 40.8279 43.2795 40.5215 43.5608C40.215 43.8421 39.7993 44.0001 39.3659 44.0001Z"
                                        fill="#8d59fe"
                                    />
                                </svg>
                            </div>
                            <div
                                className="market__item-icon market__item-icon--trash"
                                onClick={() => deleteItem(el.id)}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 39 44"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12.6618 11H1.6023C1.17734 11 0.769815 10.842 0.469326 10.5607C0.168836 10.2794 0 9.89785 0 9.50003C0 9.1022 0.168836 8.72067 0.469326 8.43936C0.769815 8.15806 1.17734 8.00003 1.6023 8.00003H11V5.32424C11 3.91218 11.5567 2.55796 12.5478 1.55948C13.5388 0.560998 14.8829 5.24888e-05 16.2844 5.24888e-05H22.6989C23.3943 -0.00215064 24.0832 0.133941 24.7263 0.40052C25.3693 0.667099 25.9539 1.05892 26.4463 1.55354C26.9388 2.04815 27.3295 2.63584 27.5961 3.28289C27.8627 3.92994 28 4.62365 28 5.32424V8.00003H37.3977C37.8227 8.00003 38.2302 8.15806 38.5307 8.43936C38.8312 8.72067 39 9.1022 39 9.50003C39 9.89785 38.8312 10.2794 38.5307 10.5607C38.2302 10.842 37.8227 11 37.3977 11H26.3382H12.6618ZM24.6765 7.65148H14.3235V5.32424C14.3235 4.80027 14.5302 4.29776 14.8979 3.92726C15.2657 3.55676 15.7644 3.3486 16.2844 3.3486H22.6989C22.9578 3.34639 23.2145 3.39586 23.4544 3.49415C23.6942 3.59245 23.9123 3.73762 24.0962 3.92129C24.28 4.10497 24.426 4.32352 24.5255 4.56431C24.6251 4.8051 24.6765 5.06338 24.6765 5.32424V7.65148ZM27.1557 43.9999H11.8764C10.7009 44.0086 9.56337 43.5743 8.68088 42.7799C7.79838 41.9855 7.23264 40.8866 7.09161 39.6929L4.01342 15.8573C3.95843 15.4246 4.07376 14.9873 4.33399 14.6416C4.59421 14.2958 4.978 14.07 5.401 14.0138C5.824 13.9575 6.25151 14.0755 6.5895 14.3416C6.92748 14.6078 7.14827 15.0004 7.20326 15.4331L10.2495 39.2034C10.2892 39.6072 10.4746 39.9814 10.7695 40.2529C11.0645 40.5244 11.4477 40.6738 11.8444 40.6717H27.1238C27.5205 40.6738 27.9039 40.5244 28.1988 40.2529C28.4937 39.9814 28.679 39.6072 28.7187 39.2034L31.8288 15.4331C31.8844 15.005 32.1036 14.617 32.4385 14.354C32.7733 14.091 33.1965 13.9745 33.6151 14.0301C34.0336 14.0869 34.413 14.3112 34.6702 14.6537C34.9273 14.9962 35.0411 15.4291 34.9867 15.8573L31.9085 39.6929C31.7681 40.881 31.207 41.9754 30.3312 42.7691C29.4555 43.5627 28.3257 44.0006 27.1557 43.9999ZM24.352 24H13.6317C13.1989 24 12.7839 23.842 12.4779 23.5607C12.1719 23.2794 12 22.8979 12 22.5C12 22.1022 12.1719 21.7207 12.4779 21.4394C12.7839 21.1581 13.1989 21 13.6317 21H24.3683C24.8011 21 25.2161 21.1581 25.5221 21.4394C25.8281 21.7207 26 22.1022 26 22.5C26 22.8979 25.8281 23.2794 25.5221 23.5607C25.2161 23.842 24.8011 24 24.3683 24H24.352ZM16.6823 33H22.3177C22.7639 33 23.1918 32.7893 23.5073 32.4142C23.8227 32.0392 24 31.5305 24 31C24 30.4696 23.8227 29.9609 23.5073 29.5858C23.1918 29.2107 22.7639 29 22.3177 29H16.6823C16.2361 29 15.8081 29.2107 15.4926 29.5858C15.1772 29.9609 15 30.4696 15 31C15 31.5305 15.1772 32.0392 15.4926 32.4142C15.8081 32.7893 16.2361 33 16.6823 33Z"
                                        fill="#8D59FE"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                    <div className="info__item">
                        <LazyLoadImage
                            width="100%"
                            height="100%"
                            placeholderSrc={loadingImg}
                            effect="blur"
                            src={`${process.env.REACT_APP_STORAGE_URL}${el.img}`}
                            alt="img"
                        />
                    </div>
                </div>
            </div>
        );
    });

    const skeletonList = skeletonArr.map((item, i) => {
        return (
            <div key={i} className="skeleton__item-slider">
                <SkeletonItem />
            </div>
        );
    });

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
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 730,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    return (
        <>
            {(changeModal || changeImg) && (
                <InfoModal
                    changeModal={changeModal}
                    setChangeModal={setChangeModal}
                    showAnimation={showAnimationInfo}
                    setShowAnimation={setShowAnimationInfo}
                    store={store}
                    changeImg={changeImg}
                    setChangeImg={setChangeImg}
                    activeItem={activeItem}
                />
            )}
            {openScale && (
                <ScaleModal
                    changeModal={openScale}
                    setChangeModal={setOpenScale}
                    showAnimation={showAnimationScale}
                    setShowAnimation={setShowAnimationScale}
                    activeItem={activeScale}
                />
            )}
            <div className="slider" ref={refs}>
                <div className="slider__title">
                    {item[store][`${store}Loading`] ? 'Загрузка...' : title}
                </div>

                {item.user.isAuth && (
                    <div className="slider__btn">
                        <motion.div
                            className="info__btn"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={openModal}>
                            Добавить
                        </motion.div>
                    </div>
                )}
                {itemList.length > 0 || item[store][`${store}Loading`] ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={item[store][`${store}Loading`]}>
                            <Slider {...settings}>
                                {item[store][`${store}Loading`]
                                    ? skeletonList
                                    : !item[store][`${store}Loading`]
                                    ? itemList
                                    : 'Ошибка'}
                            </Slider>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    ''
                )}
            </div>
        </>
    );
});

export default InfoSlider;
