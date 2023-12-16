import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState } from "react";
import { Context } from "../..";
import { fetchItems } from "../../http/itemsApi";
import { observer } from "mobx-react-lite";

import SkeletonItem from '../skeleton/SkeletonItem';
import CatalogItem from '../catalogItem/CatalogItem';

const SimilarSlider = observer(({typeId, subTypeId}) => {
    const {items} = useContext(Context);

    const [loading, setLoading] = useState(false);

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
            <CatalogItem key={item.id} item={item} />
        )
    })

    const skeletonList = skeletonArr.map((item, i) => {
        return (
            <SkeletonItem key={i}/>
        )
    })

    return (
        <div className="slider">
            <div className="slider__title">{loading ? 'Loading...' : 'Похожие товары'}</div>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={loading}
                    className="slider__flex"
                >
                    {loading ? skeletonList : itemList}
                    {!loading && itemList.length === 0 ? <span className="nothing__found">Ничего не найдено</span>: null}
                </motion.div>
            </AnimatePresence>
        </div>
    );
})

export default SimilarSlider;