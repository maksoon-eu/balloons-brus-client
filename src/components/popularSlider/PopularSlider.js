import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../..";
import { fetchItems, changeSliderType } from "../../http/itemsApi";
import PopularSliderItem from '../catalogItem/CatalogItem';
import { observer } from "mobx-react-lite";

import downArrow from '../../resources/down-arrow.svg';

import './popularSlider.scss';

const Dropdown = observer(({type, typeList, loading, setState, state, dropdownCurrent, setDropdownCurrent, subTypeId = null, setSubTypeId = null}) => {
    const [dropdownToggle, setDropdownToggle] = useState(false);

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
        if (!loading) {
            setDropdownToggle(dropdownToggle => !dropdownToggle)
        }
    }

    const onSetCurrentDropdown = (e, id) => {
        if (type === 'Категория' && subTypeId && setSubTypeId) {
            setSubTypeId(null)
        }
        setState(state => state === id ? null : id)
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

    useEffect(() => {
        if (items.sliderTypes.length !== 0) {
            setTypeId(items.sliderTypes.filter(item => item.id === id)[0].typeId)
            setSubTypeId(items.sliderTypes.filter(item => item.id === id)[0].subTypeId)
        }
    }, [items.sliderTypes])

    useEffect(() => {
        if (typeId && subTypeId) {
            if (user.isAuth) {
                changeSliderType(id, {typeId, subTypeId})
                    .then(data => {
                        items.sliderTypes.forEach(item => {
                            if (item.id === id) {
                                item.typeId = typeId
                                item.subTypeId = subTypeId
                                items.setSliderTypes(items.sliderTypes)
                            }
                        })
                    })
                    .catch(e => {
                    })
            }
            
            setLoading(true)
            fetchItems(typeId, subTypeId, null, 1, 4)
                .then(data => {
                    items[`setItemsSlider${id}`](data.rows)
                    setLoading(false)
                })
                .catch(e => {
                    setLoading(false)
                })
        }
    }, [typeId, subTypeId, user.isAuth])

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
    }, [typeId])

    const itemList = items[`itemsSlider${id}`].map(item => {
        return (
            <PopularSliderItem key={item.id} item={item} />
        )
    })

    return (
        <div className="slider">
            <div className="slider__title">{loading ? 'Loading...' : `${dropdownTypeCurrent} ${dropdownSubTypeCurrent}`}</div>

            {user.isAuth && <div className="slider__btn">
                <Dropdown 
                    type="Категория" 
                    typeList={items.types} 
                    loading={items.typesLoading} 
                    setState={setTypeId} 
                    state={typeId}
                    dropdownCurrent={dropdownTypeCurrent}
                    setDropdownCurrent={setDropdownTypeCurrent}
                    setSubTypeId={setSubTypeId} 
                    subTypeId={subTypeId}
                />
                <Dropdown 
                    type="Подкатегория" 
                    typeList={subType} 
                    loading={items.typesLoading} 
                    setState={setSubTypeId} 
                    state={subTypeId}
                    dropdownCurrent={dropdownSubTypeCurrent}
                    setDropdownCurrent={setDropdownSubTypeCurrent}
                />
            </div>}
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={loading}
                    className="slider__flex"
                >
                    {loading ? 'Loading...' : itemList}
                </motion.div>
            </AnimatePresence>
        </div>
    );
})

export default PopularSlider;