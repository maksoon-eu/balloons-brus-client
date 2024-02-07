import React, { useEffect, useContext, useState } from "react";
import { Context } from "../..";
import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSliders } from "../../http/sliderApi";
import { observer } from "mobx-react-lite";

import SkeletonMainSlider from "../skeleton/SkeletonMainSlider";
import ChangeMainSlider from "../changeMainSlider/ChangeMainSlider";

import loading from '../../resources/loading.svg';

import 'react-lazy-load-image-component/src/effects/blur.css';
import './mainSlider.scss';

const MainSlider = observer(() => {
    const [changeModal, setChangeModal] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [activeItem, setActiveItem] = useState({});

    const {sliders, user} = useContext(Context);

    const skeletonArr = ['', '', '', ''];

    useEffect(() => {
        if (sliders.updateSliders || sliders.sliders.length === 0) {
            sliders.setSlidersLoading(true)
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

            const fetchDataPromise = fetchSliders()
                .then((data) => {
                    sliders.setSliders(data)
                })
                .catch((e) => {
                    console.error(e);
                })

            Promise.all([fetchDataPromise, timeoutPromise])
                .finally(() => {
                    sliders.setSlidersLoading(false)
                    sliders.setUpdateSliders(false)
                });
        }
    }, [sliders.updateSliders])

    const sliderList = sliders.sliders.map((item) => {
        return (
            <div key={item.id}>
                <div className="mainSlider__item">
                {user.isAuth && 
                    <div className="market__item-icons mainSlider__item-icons">
                        <div className="market__item-icon" onClick={() => {setChangeModal(true); setShowAnimation(true); setActiveItem(item)}}>
                            <svg width="20" height="20" viewBox="0 0 41 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.7108 37.999H7.20161C6.64985 37.999 6.10354 37.8881 5.59378 37.6725C5.08402 37.457 4.6207 37.1411 4.23054 36.7428C3.84039 36.3446 3.53093 35.8718 3.31978 35.3514C3.10863 34.8311 3 34.2734 3 33.7101V25.7822C2.99954 24.6727 3.42187 23.6065 4.1777 22.8092L19.2768 6.75423C19.3038 6.7121 19.3328 6.67118 19.3634 6.6316C19.4601 6.50687 19.5729 6.39731 19.6984 6.30592L23.2758 2.50203C24.0168 1.71298 24.9061 1.08469 25.8906 0.654805C26.875 0.224915 27.9344 0.00230141 29.0052 0.000225502C30.0467 -0.00546473 31.0789 0.201424 32.0409 0.608747C33.003 1.01607 33.8755 1.6156 34.6073 2.37209L36.6923 4.48402C37.4284 5.23402 38.0112 6.12564 38.4074 7.10724C38.8035 8.08885 39.0049 9.14094 38.9999 10.2026V10.6899C39.0049 11.7515 38.8035 12.8036 38.4074 13.7852C38.0112 14.7668 37.4284 15.6584 36.6923 16.4084L33.9943 19.1625C33.9997 19.2291 34.0013 19.2962 33.999 19.3637C33.984 19.8132 33.7987 20.2379 33.484 20.5446C33.1693 20.8513 32.7508 21.0148 32.3208 20.9991L32.3045 20.9821H32.2117L16.7666 36.7481C16.3665 37.1566 15.8895 37.4781 15.3643 37.6931C14.8391 37.9081 14.2765 38.0122 13.7108 37.999ZM28.4528 20.12L14.3634 34.3762C14.174 34.5717 13.9166 34.6827 13.6473 34.6849H7.13788C7.00412 34.6849 6.87174 34.658 6.74817 34.6057C6.62459 34.5535 6.51228 34.4769 6.4177 34.3803C6.32312 34.2838 6.248 34.1692 6.19681 34.043C6.14562 33.9169 6.11929 33.7817 6.11929 33.6452V25.7822C6.12294 25.5156 6.22536 25.2602 6.40585 25.0674L19.6262 10.9988C21.189 16.1164 25.045 18.8586 28.4528 20.12ZM31.1404 17.4005L34.3526 14.1503C35.2347 13.2425 35.732 12.0172 35.7372 10.7386V10.2513C35.732 8.97272 35.2347 7.74745 34.3526 6.83967L32.2679 4.71148C31.3863 3.7932 30.1851 3.26769 28.9257 3.24937C28.2864 3.25196 27.6541 3.38559 27.0663 3.64233C26.4785 3.89907 25.9472 4.27366 25.504 4.74396L22.3256 8.12623C23.3012 14.8731 28.6283 16.8438 31.1404 17.4005ZM39.3659 44.0001H1.63412C1.20072 44.0001 0.785103 43.8421 0.478646 43.5608C0.172189 43.2795 0 42.8979 0 42.5001C0 42.1023 0.172189 41.7208 0.478646 41.4395C0.785103 41.1582 1.20072 41.0001 1.63412 41.0001H39.3659C39.7993 41.0001 40.215 41.1582 40.5215 41.4395C40.8279 41.7208 41 42.1023 41 42.5001C41 42.8979 40.8279 43.2795 40.5215 43.5608C40.215 43.8421 39.7993 44.0001 39.3659 44.0001Z" fill="#8d59fe"/>
                            </svg>
                        </div>
                    </div>}
                    <LazyLoadImage 
                        width='100%' height='100%'
                        placeholderSrc={loading}
                        effect="blur"
                        src={`https://s3.timeweb.com/9f5e65b7-7ed3bc97-902a-48e4-b04a-3554ca39493b/${item.img}`}
                        alt='img'
                    />
                </div>
            </div>
        )
    })

    const skeletonList = skeletonArr.map((item, i) => {
        return (
            <div key={i} className="skeleton__item-mainSlider">
                <SkeletonMainSlider/>
            </div>
        )
    })

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: false
    };

    return (
        <div className="mainSlider">
            {changeModal && <ChangeMainSlider changeModal={showAnimation} setChangeModal={setChangeModal} showAnimation={showAnimation} setShowAnimation={setShowAnimation} item={activeItem} />}
            {sliderList.length > 0 || sliders.slidersLoading ?
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={sliders.slidersLoading}
                >
                    <Slider {...settings}>
                        {sliders.slidersLoading ? skeletonList : !sliders.slidersLoading ? sliderList : "Ошибка"}
                    </Slider>
                </motion.div>
            </AnimatePresence> : ''}
        </div>
    )
})

export default MainSlider;