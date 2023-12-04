import { useEffect, useContext } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Context } from '../..';
import { fetchItems } from "../../http/itemsApi";
import CatalogItem from "../catalogItem/CatalogItem";
import { observer } from "mobx-react-lite";

import './catalog.scss';

const Catalog = observer(() => {
    const {items} = useContext(Context)

    useEffect(() => {
        items.setItemsLoading('loading')

        fetchItems(items.selectedType, items.selectedSubType, items.selectedPrice, 1, 4*items.page)
        .then(data => {
            setTimeout(() => {
            items.setItems(data.rows)
            items.setTotalCount(data.rows.length)
            items.setItemsLoading(false)
            }, 1000)
        })
        .catch(e => {
            items.setItemsLoading(false)
        })
    }, [items.selectedType, items.selectedSubType, items.selectedPrice])

    const updateListItem = () => {
        items.setItemsLoading('updateLoading')

        fetchItems(items.selectedType, items.selectedSubType, items.selectedPrice, items.page, 4)
        .then(data => {
            items.setItems([...items.items, ...data.rows])
            items.setTotalCount(data.rows.length)
            items.setItemsLoading(false)
        })
        .catch(e => {
            items.setItemsLoading(false)
        })
    }

    const loadMore = () => {
        if (!items.itemsLoading && items.totalCount % 4 === 0) {
            items.setPage(items.page + 1)
            updateListItem()
        }
    }

    const itemList = items.items.map(item => {
        return (
            <CatalogItem key={item.id} item={item} />
        )
    })

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                exit={{opacity: 0}}
                key={items.itemsLoading === 'loading'}
                className="market"
            >
                {items.itemsLoading === 'loading' ? 'Loading...' : itemList}
            </motion.div>
            <motion.div 
                className="load__more"
                whileHover={{ scale: 1.05, translateY: -3 }}
                whileTap={{ scale: 0.9 }}
                onClick={loadMore}
            >Загрузить Еще</motion.div>
        </AnimatePresence>
    )
})

export default Catalog;