import { useEffect, useContext, useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Context } from '../..';
import { fetchItems } from "../../http/itemsApi";
import { observer } from "mobx-react-lite";

import SkeletonItem from "../skeleton/SkeletonItem";
import CatalogItem from "../catalogItem/CatalogItem";
import SortModal from "../sortModal/SortModal";
import ChangeModal from "../changeModal/ChangeModal";

import './catalog.scss';

const Catalog = observer(() => {
    const [sortModal, setSortModal] = useState(false);

    const [changeModal, setChangeModal] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [activeItem, setActiveItem] = useState({});

    const refSort = useRef(null);

    const {items} = useContext(Context);

    const skeletonArr = ['', '', '', '', '', '', '', '', '', '', '', ''];
    let itemList = [];

    useEffect(() => {
        if (!items.itemsLoading ) {
            const scrollPosition = sessionStorage.getItem('scrollPosition');
            if (scrollPosition) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(scrollPosition, 10));
                    sessionStorage.removeItem('scrollPosition');
                }, 10)
            }
        }
    }, [items.itemsLoading]);

    useEffect(() => {
        if (itemList.length === 0 || items.updateList) {
            items.setItemsLoading('loading')

            fetchItems(items.selectedType, items.selectedSubType, items.selectedPrice, 1, 12*items.page, items.itemsSort)
            .then(data => {
                setTimeout(() => {
                items.setItems(data.rows)
                items.setTotalCount(data.rows.length)
                items.setItemsLoading(false)
                items.setUpdateList(false)
                }, 3000)
            })
            .catch(e => {
                items.setItemsLoading(false)
                items.setUpdateList(false)
            })
        }
    }, [items.selectedType, items.selectedSubType, items.selectedPrice, items.itemsSort, items.updateList])

    const updateListItem = () => {
        items.setItemsLoading('updateLoading')

        fetchItems(items.selectedType, items.selectedSubType, items.selectedPrice, items.page, 12, items.itemsSort)
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
        if (!items.itemsLoading && items.totalCount % 12 === 0) {
            items.setPage(items.page + 1)
            updateListItem()
        }
    }

    const onSortModal = () => {
        if (!items.itemsLoading) {
            setSortModal(sortModal => !sortModal)
        }
    }

    itemList = items.items.map(item => {
        return (
            <CatalogItem key={item.id} item={item} setChangeModal={setChangeModal} setShowAnimation={setShowAnimation} setActiveItem={setActiveItem} />
        )
    })

    const skeletonList = skeletonArr.map((item, i) => {
        return (
            <SkeletonItem key={i}/>
        )
    })

    return (
        <>
            <div className="minHeight-market">
            {changeModal && <ChangeModal changeModal={showAnimation} setChangeModal={setChangeModal} showAnimation={showAnimation} setShowAnimation={setShowAnimation} item={activeItem} />}
            <div className="sort" ref={refSort}>
                <div className="sort__btn">
                    <svg width="25" height="25" viewBox="0 0 45 39" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onSortModal}>
                        <path fillRule="evenodd" clipRule="evenodd" d="M17.5 17C15.8182 17 14.1741 16.501 12.7759 15.5663C11.3778 14.6316 10.2883 13.3032 9.64542 11.749C9.41136 11.1832 9.24033 10.5967 9.13337 10H1.54839C1.13773 10 0.743913 9.84199 0.453535 9.56069C0.163156 9.27938 0 8.89783 0 8.5C0 8.10218 0.163156 7.72067 0.453535 7.43936C0.743913 7.15806 1.13773 7 1.54839 7H9.13342C9.14325 6.94519 9.15362 6.89043 9.16454 6.83575C9.49383 5.18647 10.305 3.67192 11.4954 2.48383C12.6857 1.29573 14.2018 0.487499 15.8517 0.161358C17.5016 -0.164782 19.2112 0.00585949 20.7641 0.651693C22.317 1.29753 23.6433 2.38949 24.5754 3.78944C25.5074 5.18939 26.0032 6.83437 26 8.5162C25.9957 10.7677 25.0983 12.9256 23.5047 14.5162C21.9111 16.1067 19.7515 17 17.5 17ZM17.5 3.26049C16.4605 3.26049 15.4444 3.5687 14.5801 4.14621C13.7158 4.72372 13.0422 5.54456 12.6444 6.50491C12.2466 7.46527 12.1425 8.52206 12.3453 9.54157C12.548 10.5611 13.0486 11.4975 13.7836 12.2325C14.5187 12.9676 15.4552 13.4681 16.4747 13.6709C17.4942 13.8737 18.551 13.7697 19.5113 13.3719C20.4717 12.9741 21.2925 12.3004 21.87 11.4361C22.4475 10.5718 22.7557 9.55569 22.7557 8.5162C22.7514 7.12361 22.1964 5.78927 21.2117 4.80456C20.227 3.81985 18.8926 3.26477 17.5 3.26049ZM34.864 32H43.3226C43.7675 32 44.1941 31.842 44.5087 31.5607C44.8232 31.2794 45 30.8978 45 30.5C45 30.1022 44.8232 29.7207 44.5087 29.4394C44.1941 29.1581 43.7675 29 43.3226 29H34.8666C34.6608 27.8525 34.2202 26.7541 33.5663 25.776C32.6316 24.3778 31.3032 23.2883 29.7491 22.6455C28.1949 22.0026 26.485 21.8352 24.8357 22.1645C23.1864 22.4938 21.672 23.3049 20.4839 24.4953C19.2958 25.6857 18.4875 27.2018 18.1613 28.8517C17.8352 30.5016 18.0059 32.2111 18.6517 33.764C19.2976 35.3169 20.3895 36.6433 21.7895 37.5754C23.1894 38.5074 24.8343 39.0032 26.5162 39C28.7664 38.9914 30.9217 38.0926 32.5114 36.5C33.7432 35.2658 34.5577 33.6927 34.864 32ZM43.3674 10H30.6326C30.1996 10 29.7844 9.84199 29.4782 9.56069C29.172 9.27938 29 8.89783 29 8.5C29 8.10218 29.172 7.72067 29.4782 7.43936C29.7844 7.15806 30.1996 7 30.6326 7H43.3674C43.8004 7 44.2156 7.15806 44.5218 7.43936C44.828 7.72067 45 8.10218 45 8.5C45 8.89783 44.828 9.27938 44.5218 9.56069C44.2156 9.84199 43.8004 10 43.3674 10ZM1.63266 32H14.3673C14.8004 32 15.2156 31.842 15.5218 31.5607C15.828 31.2794 16 30.8978 16 30.5C16 30.1022 15.828 29.7207 15.5218 29.4394C15.2156 29.1581 14.8004 29 14.3673 29H1.63266C1.19965 29 0.7844 29.1581 0.478217 29.4394C0.172035 29.7207 0 30.1022 0 30.5C0 30.8978 0.172035 31.2794 0.478217 31.5607C0.7844 31.842 1.19965 32 1.63266 32ZM23.5902 26.1395C24.457 25.5632 25.4753 25.2573 26.5162 25.2605C27.9045 25.2648 29.2347 25.8181 30.2164 26.7998C31.198 27.7815 31.7515 29.1117 31.7557 30.5C31.7589 31.5408 31.453 32.5592 30.8767 33.426C30.3005 34.2928 29.4798 34.9689 28.5188 35.3687C27.5578 35.7685 26.4997 35.874 25.4787 35.6717C24.4577 35.4694 23.5197 34.9685 22.7837 34.2325C22.0477 33.4965 21.5468 32.5586 21.3445 31.5376C21.1423 30.5165 21.2477 29.4585 21.6475 28.4974C22.0473 27.5364 22.7234 26.7157 23.5902 26.1395Z" fill="#8d59fe"/>
                    </svg>
                </div>
                <SortModal sortModal={sortModal} setSortModal={setSortModal} refSort={refSort}/>
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={items.itemsLoading === 'loading'}
                    className="market"
                >
                    {items.itemsLoading === 'loading' ? skeletonList : items.itemsLoading !== 'loading' && itemList.length === 0 ? <span className="nothing__found">Ничего не найдено</span> : itemList}
                </motion.div>
            </AnimatePresence>
            </div>
            {items.totalCount % 4 === 0 && items.totalCount !== 0 &&
                <motion.div 
                    className="load__more"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={loadMore}
                >Загрузить Еще</motion.div>
            }
        </>
    )
})

export default Catalog;