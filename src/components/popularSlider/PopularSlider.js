import Slider from "react-slick";
import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../..";
import { fetchItems, changeSliderType } from "../../http/itemsApi";
import { observer } from "mobx-react-lite";

import SkeletonItem from '../skeleton/SkeletonItem';
import CatalogItem from '../catalogItem/CatalogItem';
import ChangeModal from "../changeModal/ChangeModal";

import downArrow from '../../resources/down-arrow.svg';

import './popularSlider.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Dropdown = observer(({type, typeList, loading, setState, state, dropdownCurrent, setDropdownCurrent, subTypeId = null, setSubTypeId = null, setUpdateList}) => {
    const [dropdownToggle, setDropdownToggle] = useState(false);

    const {items} = useContext(Context);

    const ref = useRef(null)

    useEffect(() => {
        const clickOutElement = (e) => {
            if (dropdownToggle && ref.current && !ref.current.contains(e.target)) {
                setDropdownToggle(false)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [dropdownToggle])

    const onDropdownActive = () => {
        if (!loading && !items.typeLoading) {
            setDropdownToggle(dropdownToggle => !dropdownToggle)
        }
    }

    const onSetCurrentDropdown = (e, id) => {
        if (type === 'Категория' && subTypeId && setSubTypeId) {
            setSubTypeId(null)
        }
        setState(state => state === id ? null : id)
        setUpdateList(true)
        setDropdownCurrent(dropdownCurrent === e.currentTarget.textContent ? false : e.currentTarget.textContent)
        setDropdownToggle(false)
    }

    const types = typeList.map(item => {
        return (
            <li key={item.id} onClick={(e) => onSetCurrentDropdown(e, item.id)} className={`dropdown__menu-item ${state === item.id ? 'active' : ''}`}>{item.name}</li>
        )
    })

    return (
        <div ref={ref} className={`dropdown dropdown-min ${dropdownToggle ? 'active' : ''}`} tabIndex="1">
            <div className="dropdown__current" onClick={onDropdownActive}>
                <div className="dropdown__current-item">{!dropdownCurrent ? type : dropdownCurrent}</div>
                <img src={downArrow} alt="" />
            </div>
            <ul className="dropdown__menu">
                <li onClick={() => {setDropdownCurrent(false); setState(null)}} className={`dropdown__menu-item ${!state ? 'active' : ''}`}>{type}</li>
                {types.length ? types : <div className="dropdown__menu-item">Подкатегории отсутствуют</div>}
            </ul>
        </div>
    );
});

const PopularSlider = observer(({id}) => {
    const {items, user} = useContext(Context);

    const [typeId, setTypeId] = useState(null);
    const [subTypeId, setSubTypeId] = useState(null);
    const [subType, setSubType] = useState([]);
    const [dropdownTypeCurrent, setDropdownTypeCurrent] = useState(false);
    const [dropdownSubTypeCurrent, setDropdownSubTypeCurrent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updateList, setUpdateList] = useState(false);

    const [changeModal, setChangeModal] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [activeItem, setActiveItem] = useState({});

    const skeletonArr = ['', '', '', ''];
    let itemList = [];

    useEffect(() => {
        if (items.sliderTypes.length !== 0) {
            setTypeId(items.sliderTypes.filter(item => item.id === id)[0].typeId)
            setSubTypeId(items.sliderTypes.filter(item => item.id === id)[0].subTypeId)
        }
    }, [items.sliderTypes])

    useEffect(() => {
        if (typeId && subTypeId && (itemList.length === 0 || updateList || items.updateList)) {
            if (user.isAuth) {
                changeSliderType(id, {typeId, subTypeId})
                    .then(data => {
                        setTimeout(() => {
                            items.sliderTypes.forEach(item => {
                                if (item.id === id) {
                                    item.typeId = typeId
                                    item.subTypeId = subTypeId
                                    items.setSliderTypes(items.sliderTypes)
                                }
                            })
                        }, 1000)
                    })
                    .catch(e => {
                    })
            }

            setLoading(true)
            fetchItems(typeId, subTypeId, null, 1, 8)
                .then(data => {
                    setTimeout(() => {
                    items[`setItemsSlider${id}`](data.rows)
                    setLoading(false)
                    items.setUpdateList(false)
                    }, 2000)
                })
                .catch(e => {
                    setLoading(false)
                    items.setUpdateList(false)
                })
        } else if (itemList.length > 0) {
            setLoading(false)
        }
    }, [typeId, subTypeId, user.isAuth, items.updateList])

    useEffect(() => {
        setDropdownSubTypeCurrent(false)

        if (!typeId) {
            setSubType([])
        } else {
            items.types.forEach(item => {
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
    }, [typeId, items.typesLoading])

    itemList = items[`itemsSlider${id}`].map(item => {
        return (
            <div key={item.id} className="market__item-slider">
                <CatalogItem item={item} setChangeModal={setChangeModal} setShowAnimation={setShowAnimation} setActiveItem={setActiveItem} />
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
            <div className="slider__title">{loading || items.typesLoading ? 'Загрузка...' : `${dropdownTypeCurrent} ${dropdownSubTypeCurrent}`}</div>

            {user.isAuth && <div className="slider__btn">
                <Dropdown 
                    type="Категория" 
                    typeList={items.types} 
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
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={loading || items.typesLoading}
                >
                    <Slider {...settings}>
                        {loading || items.typesLoading ? skeletonList : !loading && !items.typesLoading && itemList.length === 0 ? <span className="nothing__found">Ничего не найдено</span> : itemList}
                    </Slider>
                </motion.div>
            </AnimatePresence>
        </div>
    );
})

export default PopularSlider;