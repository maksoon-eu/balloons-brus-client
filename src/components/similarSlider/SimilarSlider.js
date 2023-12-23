import Slider from "react-slick";
import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState } from "react";
import { Context } from "../..";
import { fetchItems } from "../../http/itemsApi";
import { observer } from "mobx-react-lite";

import SkeletonItem from '../skeleton/SkeletonItem';
import CatalogItem from '../catalogItem/CatalogItem';
import ChangeModal from "../changeModal/ChangeModal";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SimilarSlider = observer(({typeId, subTypeId}) => {
    const {items} = useContext(Context);

    const [loading, setLoading] = useState(false);
    const [changeModal, setChangeModal] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [activeItem, setActiveItem] = useState({});

    const skeletonArr = ['', '', '', ''];
    let itemList = [];

    useEffect(() => {
        if (typeId && subTypeId) {
        setLoading(true)
        fetchItems(typeId, subTypeId, null, 1, 4)
            .then(data => {
                setTimeout(() => {
                items.setSimilarItems(data.rows)
                setLoading(false)
                }, 2000)
            })
            .catch(e => {
                setLoading(false)
            })
        }
    }, [typeId, subTypeId])

    itemList = items.similarItems.map(item => {
        return (
            <div key={item.id} className="market__item-slider">
                <CatalogItem item={item} setChangeModal={setChangeModal} setShowAnimation={setShowAnimation} setActiveItem={setActiveItem} />
            </div>
        )
    })

    const skeletonList = skeletonArr.map((item, i) => {
        return (
            <div key={i} className="skeleton__item-slider">
                <SkeletonItem />
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
        <div className="slider">
            <div className="slider__title">{loading ? 'Loading...' : 'Похожие товары'}</div>
            {changeModal && <ChangeModal changeModal={showAnimation} setChangeModal={setChangeModal} showAnimation={showAnimation} setShowAnimation={setShowAnimation} item={activeItem} />}
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={loading}
                >
                    <Slider {...settings}>
                        {loading ? skeletonList : !loading && itemList.length === 0 ? <span className="nothing__found">Ничего не найдено</span> : itemList}
                    </Slider>
                </motion.div>
            </AnimatePresence>
        </div>
    );
})

export default SimilarSlider;