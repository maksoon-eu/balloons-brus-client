import { useState, useRef, useEffect } from "react";
import { useOnScreen } from "../../hooks/screen.hook";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

import '../popularSlider/popularSlider.scss';

const CatalogItem = (item) => {
    const [count, setCount] = useState(1);
    const controls = useAnimation();
    const rootRef = useRef(null);
    const onScreen = useOnScreen(rootRef);

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
        >
            <Link to={`/catalog/${item.id}`} className="slider__item">
                <div className="slider__item-top">
                    <LazyLoadImage 
                        width='100%' height='100%'
                        // placeholderSrc={}
                        effect="blur"
                        src={`http://localhost:4000/${item.item.img}`}
                        alt='img'
                    />
                </div>
                <div className="slider__item-bottom">
                    <div className="slider__item-name">{item.item.name}</div>
                    <div className="slider__item-price">{`${item.item.price} ₽`}</div>
                    <div className="slider__item-group">
                        <div className="slider__item-counter">
                            <div className="slider__counter-btn" onClick={calcMinus}>
                                <svg width="12" height="12" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.44934 1H0.55066C0.404616 1 0.264561 0.947322 0.161292 0.853554C0.0580238 0.759786 0 0.632608 0 0.5C0 0.367392 0.0580238 0.240214 0.161292 0.146446C0.264561 0.052678 0.404616 0 0.55066 0H9.44934C9.59538 0 9.73544 0.052678 9.83871 0.146446C9.94198 0.240214 10 0.367392 10 0.5C10 0.632608 9.94198 0.759786 9.83871 0.853554C9.73544 0.947322 9.59538 1 9.44934 1Z" fill="#4B5563"/>
                                </svg>
                            </div>
                            <span>{count}</span>
                            <div className="slider__counter-btn" onClick={calcPlus}>
                                <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4.49538 9.81091C4.58888 9.91389 4.71569 9.97174 4.84793 9.97174C4.9134 9.97174 4.97824 9.95754 5.03873 9.92994C5.09922 9.90235 5.15421 9.8619 5.2005 9.81091C5.2468 9.75992 5.28351 9.69939 5.30857 9.63277C5.33362 9.56615 5.34651 9.49475 5.34651 9.42264V5.65062H9.4509C9.59653 5.65062 9.73619 5.59809 9.83916 5.50459C9.94214 5.41108 10 5.28427 10 5.15203C10 5.0198 9.94214 4.89298 9.83916 4.79948C9.73619 4.70597 9.59653 4.65344 9.4509 4.65344H5.34651V0.549105C5.34651 0.403473 5.29401 0.263806 5.2005 0.160829C5.107 0.0578515 4.98016 0 4.84793 0C4.71569 0 4.58888 0.0578515 4.49538 0.160829C4.40188 0.263806 4.34934 0.403473 4.34934 0.549105V4.65344H0.577365C0.431733 4.65344 0.292074 4.70597 0.189097 4.79948C0.0861193 4.89298 0.0282593 5.0198 0.0282593 5.15203C0.0282593 5.28427 0.0861193 5.41108 0.189097 5.50459C0.292074 5.59809 0.431733 5.65062 0.577365 5.65062H4.34934V9.42264C4.34934 9.56827 4.40188 9.70794 4.49538 9.81091Z" fill="#4B5563"/>
                                </svg>
                            </div>
                        </div>
                        <motion.div
                            className="slider__item-btn"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.9 }}
                        >В корзину</motion.div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default CatalogItem;