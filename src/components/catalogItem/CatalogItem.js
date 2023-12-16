import { useState, useRef, useEffect, useContext } from "react";
import { useOnScreen } from "../../hooks/screen.hook";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

import ChangeModal from "../changeModal/ChangeModal";

import loading from '../../resources/loading.svg'

import 'react-lazy-load-image-component/src/effects/opacity.css';
import './catalogItem.scss';

const CatalogItem = observer(({item}) => {
    const [count, setCount] = useState(1);
    const [changeModal, setChangeModal] = useState(false);

    const rootRef = useRef(null);

    const controls = useAnimation();
    const onScreen = useOnScreen(rootRef);

    const {user} = useContext(Context)

    useEffect(() => {
        if (onScreen) {
            controls.start({
                y: 0,
                opacity: 1,
                transition: {
                duration: 0.6,
                ease: "easeOut"
                }
            });
        }
    }, [onScreen, controls]);

    const calcPlus = () => {
        if (count > 0) {
            setCount(count => count + 1)
        }
    }

    const calcMinus = () => {
        if (count > 1) {
            setCount(count => count - 1)
        }
    }

    return (
        <>
        <ChangeModal changeModal={changeModal} setChangeModal={setChangeModal}/>
        <motion.div
            ref={rootRef}
            initial={{ opacity: 0, y: 10 }}
            animate={controls}
            exit={{ opacity: 0, y: -10 }}
            variants={{
                open: {
                    opacity: 1, y: 0
                },
                closed: {
                    opacity: 0, y: 20
                }
            }}
            onClick={() => sessionStorage.setItem('scrollPosition', window.scrollY)}
            className="market__item"
        >
            {user.isAuth && 
                <div className="market__item-icon" onClick={() => setChangeModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 41 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.7108 37.999H7.20161C6.64985 37.999 6.10354 37.8881 5.59378 37.6725C5.08402 37.457 4.6207 37.1411 4.23054 36.7428C3.84039 36.3446 3.53093 35.8718 3.31978 35.3514C3.10863 34.8311 3 34.2734 3 33.7101V25.7822C2.99954 24.6727 3.42187 23.6065 4.1777 22.8092L19.2768 6.75423C19.3038 6.7121 19.3328 6.67118 19.3634 6.6316C19.4601 6.50687 19.5729 6.39731 19.6984 6.30592L23.2758 2.50203C24.0168 1.71298 24.9061 1.08469 25.8906 0.654805C26.875 0.224915 27.9344 0.00230141 29.0052 0.000225502C30.0467 -0.00546473 31.0789 0.201424 32.0409 0.608747C33.003 1.01607 33.8755 1.6156 34.6073 2.37209L36.6923 4.48402C37.4284 5.23402 38.0112 6.12564 38.4074 7.10724C38.8035 8.08885 39.0049 9.14094 38.9999 10.2026V10.6899C39.0049 11.7515 38.8035 12.8036 38.4074 13.7852C38.0112 14.7668 37.4284 15.6584 36.6923 16.4084L33.9943 19.1625C33.9997 19.2291 34.0013 19.2962 33.999 19.3637C33.984 19.8132 33.7987 20.2379 33.484 20.5446C33.1693 20.8513 32.7508 21.0148 32.3208 20.9991L32.3045 20.9821H32.2117L16.7666 36.7481C16.3665 37.1566 15.8895 37.4781 15.3643 37.6931C14.8391 37.9081 14.2765 38.0122 13.7108 37.999ZM28.4528 20.12L14.3634 34.3762C14.174 34.5717 13.9166 34.6827 13.6473 34.6849H7.13788C7.00412 34.6849 6.87174 34.658 6.74817 34.6057C6.62459 34.5535 6.51228 34.4769 6.4177 34.3803C6.32312 34.2838 6.248 34.1692 6.19681 34.043C6.14562 33.9169 6.11929 33.7817 6.11929 33.6452V25.7822C6.12294 25.5156 6.22536 25.2602 6.40585 25.0674L19.6262 10.9988C21.189 16.1164 25.045 18.8586 28.4528 20.12ZM31.1404 17.4005L34.3526 14.1503C35.2347 13.2425 35.732 12.0172 35.7372 10.7386V10.2513C35.732 8.97272 35.2347 7.74745 34.3526 6.83967L32.2679 4.71148C31.3863 3.7932 30.1851 3.26769 28.9257 3.24937C28.2864 3.25196 27.6541 3.38559 27.0663 3.64233C26.4785 3.89907 25.9472 4.27366 25.504 4.74396L22.3256 8.12623C23.3012 14.8731 28.6283 16.8438 31.1404 17.4005ZM39.3659 44.0001H1.63412C1.20072 44.0001 0.785103 43.8421 0.478646 43.5608C0.172189 43.2795 0 42.8979 0 42.5001C0 42.1023 0.172189 41.7208 0.478646 41.4395C0.785103 41.1582 1.20072 41.0001 1.63412 41.0001H39.3659C39.7993 41.0001 40.215 41.1582 40.5215 41.4395C40.8279 41.7208 41 42.1023 41 42.5001C41 42.8979 40.8279 43.2795 40.5215 43.5608C40.215 43.8421 39.7993 44.0001 39.3659 44.0001Z" fill="#8d59fe"/>
                    </svg>
                </div>
            }
            <Link to={`/catalog/${item.id}`} className="market__item-hover">
                <div className="market__item-top">
                    <LazyLoadImage 
                        width='100%' height='100%'
                        placeholderSrc={loading}
                        effect="opacity"
                        src={`http://localhost:4000/${item.img}`}
                        crossOrigin="anonymous"
                        alt='img'
                    />
                </div>
                <div className="market__item-bottom">
                    <div className="market__item-name">{item.name.length > 15 ? item.name.slice(0, 15)+ '...' : item.name}</div>
                    <div className="market__item-price">{`${item.price} ₽`}</div>
                    <div className="market__item-group">
                        <div className="market__item-counter">
                            <div className="market__counter-btn" onClick={calcMinus}>
                                <svg width="12" height="12" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.44934 1H0.55066C0.404616 1 0.264561 0.947322 0.161292 0.853554C0.0580238 0.759786 0 0.632608 0 0.5C0 0.367392 0.0580238 0.240214 0.161292 0.146446C0.264561 0.052678 0.404616 0 0.55066 0H9.44934C9.59538 0 9.73544 0.052678 9.83871 0.146446C9.94198 0.240214 10 0.367392 10 0.5C10 0.632608 9.94198 0.759786 9.83871 0.853554C9.73544 0.947322 9.59538 1 9.44934 1Z" fill="#4B5563"/>
                                </svg>
                            </div>
                            <span>{count}</span>
                            <div className="market__counter-btn" onClick={calcPlus}>
                                <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4.49538 9.81091C4.58888 9.91389 4.71569 9.97174 4.84793 9.97174C4.9134 9.97174 4.97824 9.95754 5.03873 9.92994C5.09922 9.90235 5.15421 9.8619 5.2005 9.81091C5.2468 9.75992 5.28351 9.69939 5.30857 9.63277C5.33362 9.56615 5.34651 9.49475 5.34651 9.42264V5.65062H9.4509C9.59653 5.65062 9.73619 5.59809 9.83916 5.50459C9.94214 5.41108 10 5.28427 10 5.15203C10 5.0198 9.94214 4.89298 9.83916 4.79948C9.73619 4.70597 9.59653 4.65344 9.4509 4.65344H5.34651V0.549105C5.34651 0.403473 5.29401 0.263806 5.2005 0.160829C5.107 0.0578515 4.98016 0 4.84793 0C4.71569 0 4.58888 0.0578515 4.49538 0.160829C4.40188 0.263806 4.34934 0.403473 4.34934 0.549105V4.65344H0.577365C0.431733 4.65344 0.292074 4.70597 0.189097 4.79948C0.0861193 4.89298 0.0282593 5.0198 0.0282593 5.15203C0.0282593 5.28427 0.0861193 5.41108 0.189097 5.50459C0.292074 5.59809 0.431733 5.65062 0.577365 5.65062H4.34934V9.42264C4.34934 9.56827 4.40188 9.70794 4.49538 9.81091Z" fill="#4B5563"/>
                                </svg>
                            </div>
                        </div>
                        <motion.div
                            className="market__item-btn"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.9 }}
                        >В корзину</motion.div>
                    </div>
                </div>
            </Link>
        </motion.div>
        </>
    )
})

export default CatalogItem;