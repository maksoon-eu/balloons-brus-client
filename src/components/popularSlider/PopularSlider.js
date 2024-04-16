import Slider from "react-slick";
import { motion, AnimatePresence } from 'framer-motion';
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../..";
import { fetchItems } from "../../http/itemsApi";
import { changeSliderType } from "../../http/typesApi";
import { observer } from "mobx-react-lite";

import Dropdown from "../dropdown/Dropdown";
import SkeletonItem from '../skeleton/SkeletonItem';
import CatalogItem from '../catalogItem/CatalogItem';
import ChangeModal from "../changeModal/ChangeModal";

import './popularSlider.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PopularSlider = observer(({id}) => {
    const {items, types, user} = useContext(Context);

    const navigate = useNavigate();

    const [typeId, setTypeId] = useState(false);
    const [subTypeId, setSubTypeId] = useState(false);
    const [subType, setSubType] = useState([]);
    const [dropdownTypeCurrent, setDropdownTypeCurrent] = useState(false);
    const [dropdownSubTypeCurrent, setDropdownSubTypeCurrent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updateList, setUpdateList] = useState(false);
    const [changeModal, setChangeModal] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [activeItem, setActiveItem] = useState({});
    const [error, setError] = useState(false);

    const skeletonArr = ['', '', '', ''];

    useEffect(() => {
        if (types.sliderTypes.length !== 0) {
            setTypeId(types.sliderTypes.filter(item => item.id === id)[0].typeId)
            setSubTypeId(types.sliderTypes.filter(item => item.id === id)[0].subTypeId)
        }
    }, [types.sliderTypes])

    useEffect(() => {
        if (typeId && subTypeId && (items[`itemsSlider${id}`].length === 0 || updateList || items.updateList)) {
            if (user.isAuth && typeId !== types.sliderTypes.filter(item => item.id === id)[0].typeId && subTypeId !== types.sliderTypes.filter(item => item.id === id)[0].subTypeId) {
                changeSliderType(id, {typeId, subTypeId})
                    .then(data => {
                        types.sliderTypes.forEach(item => {
                            if (item.id === id) {
                                item.typeId = typeId
                                item.subTypeId = subTypeId
                                types.setSliderTypes(types.sliderTypes)
                            }
                        })
                    })
                    .catch(e => {
                        console.error(e)
                        setError(true)
                    })
            }
            setLoading(true)
            fetchItems(typeId, subTypeId, null, 1, 8)
                .then(data => {
                    items[`setItemsSlider${id}`](data.rows)
                    setLoading(false)
                    items.setUpdateList(false)
                })
                .catch(e => {
                    setLoading(false)
                    items.setUpdateList(false)
                })
        } else {
            setLoading(false)
        }
    }, [typeId, subTypeId, user.isAuth, items.updateList])

    useEffect(() => {
        setDropdownSubTypeCurrent(false)

        if (!typeId) {
            setSubType([])
        } else {
            types.types.forEach(item => {
                if (item.id === typeId) {
                    setDropdownTypeCurrent(item.name)
                    setSubType(item.subType)
                    item.subType.forEach(item => {
                        if (item.id === subTypeId) {
                            setDropdownSubTypeCurrent(item.name)
                        }
                    })
                }
            })
        }
    }, [typeId, types.typesLoading])

    const navigateToCatalog = () => {
        if (!loading && !types.typesLoading && dropdownTypeCurrent && dropdownSubTypeCurrent) {
            items.setSelectedType(typeId)
            items.setSelectedSubType(subTypeId)
            items.setUpdateList(true)
            navigate("/catalog")
        }
    }

    const itemList = items[`itemsSlider${id}`].map(item => {
        return (
            <div key={item.id} className="market__item-slider">
                <div className="market__item-popular">
                    <CatalogItem item={item} setChangeModal={setChangeModal} setShowAnimation={setShowAnimation} setActiveItem={setActiveItem} />
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
        <div className="slider">
            <div className="slider__title slider__title--hover" onClick={navigateToCatalog}>{items[`itemsSlider${id}`].length === 0 || types.typesLoading ? 'Загрузка...' : `${!dropdownTypeCurrent ? 'Не' : dropdownTypeCurrent} ${!dropdownSubTypeCurrent ? 'выбрано' : dropdownSubTypeCurrent}`}</div>

            {user.isAuth && <div className="slider__btn">
                <Dropdown 
                    type="Категория" 
                    typeList={types.types} 
                    loading={loading} 
                    setState={setTypeId} 
                    state={typeId}
                    dropdownCurrent={dropdownTypeCurrent}
                    setDropdownCurrent={setDropdownTypeCurrent}
                    setSubTypeId={setSubTypeId} 
                    subTypeId={subTypeId}
                    setUpdateList={setUpdateList}
                />
                <Dropdown 
                    type="Подкатегория" 
                    typeList={subType} 
                    loading={loading} 
                    setState={setSubTypeId} 
                    state={subTypeId}
                    dropdownCurrent={dropdownSubTypeCurrent}
                    setDropdownCurrent={setDropdownSubTypeCurrent}
                    setUpdateList={setUpdateList}
                />
            </div>}
            {changeModal && <ChangeModal changeModal={showAnimation} setChangeModal={setChangeModal} showAnimation={showAnimation} setShowAnimation={setShowAnimation} item={activeItem} />}
            {itemList.length > 0 || error || loading ? 
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={loading || types.typesLoading}
                >
                    <Slider {...settings}>
                        {loading || types.typesLoading ? skeletonList : !loading && !types.typesLoading ? itemList : "Ошибка"}
                    </Slider>
                </motion.div>
            </AnimatePresence> : ''}
        </div>
    );
})

export default PopularSlider;