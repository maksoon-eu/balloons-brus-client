import Slider from 'react-slick';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import { fetchItems } from '../../http/itemsApi';
import { observer } from 'mobx-react-lite';

import SkeletonItem from '../skeleton/SkeletonItem';
import CatalogItem from '../catalogItem/CatalogItem';
import ChangeModal from '../changeModal/ChangeModal';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SimilarSlider = observer(({ typeId, subTypeId }) => {
    const { items } = useContext(Context);

    const [loading, setLoading] = useState(true);
    const [changeModal, setChangeModal] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [activeItem, setActiveItem] = useState({});

    const skeletonArr = ['', '', '', ''];

    useEffect(() => {
        if (typeId && subTypeId) {
            setLoading(true);
            const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1000));

            const fetchDataPromise = fetchItems(typeId, subTypeId[0], null, 1, 4)
                .then((data) => {
                    items.setSimilarItems(data.rows);
                })
                .catch((e) => {
                    console.error(e);
                });

            Promise.all([fetchDataPromise, timeoutPromise]).finally(() => {
                setLoading(false);
            });
        }
    }, [typeId, subTypeId]);

    const itemList = items.similarItems.map((item) => {
        return (
            <div key={item.id} className="market__item-slider">
                <div className="market__item-popular">
                    <CatalogItem
                        item={item}
                        setChangeModal={setChangeModal}
                        setShowAnimation={setShowAnimation}
                        setActiveItem={setActiveItem}
                    />
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
        <div className="slider">
            <div className="slider__title">{loading ? 'Загрузка...' : 'Похожие товары'}</div>
            {changeModal && (
                <ChangeModal
                    changeModal={showAnimation}
                    setChangeModal={setChangeModal}
                    showAnimation={showAnimation}
                    setShowAnimation={setShowAnimation}
                    item={activeItem}
                />
            )}
            {itemList.length > 0 || loading ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={loading}>
                        <Slider {...settings}>
                            {loading ? skeletonList : !loading ? itemList : 'Ошибка'}
                        </Slider>
                    </motion.div>
                </AnimatePresence>
            ) : itemList.length === 0 ? (
                <span className="nothing__found">Ничего не найдено</span>
            ) : (
                ''
            )}
        </div>
    );
});

export default SimilarSlider;
