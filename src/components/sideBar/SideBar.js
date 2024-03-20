import React, { useRef, useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { fetchTypes } from "../../http/itemsApi";
import { useLocation } from 'react-router-dom';
import { useClickOut } from "../../hooks/clickOut.hook";

import downArrow from '../../resources/down-arrow.svg';

import './sideBar.scss'

const LiItems = observer(({typeId = null, name, i, expanded, setExpanded, price = false, subType = false, clear = false, setSideOpened, priceInputs, setPriceInputs}) => {
    const isOpen = i === expanded;
    const [inputError, setInputError] = useState(false);

    const location = useLocation();

    const {items} = useContext(Context);

    useEffect(() => {
        if (location.pathname === '/catalog' && items.selectedPrice.priceLow) {
            setPriceInputs([items.selectedPrice.priceLow, items.selectedPrice.priceMax])
        }
    }, [location.pathname])

    const onPriceInputs = (e) => {
        if (e.target.value.charAt(0) === ' ') {
            e.target.value = ''
        }
        setPriceInputs(priceInputs.map((item, i) => i === +e.target.name ? e.target.value : item))
        setInputError(false)
    }

    const changeFilters = (typeId, subTypeId) => {
        if (!items.itemsLoading) {
            if (items.selectedSubType === subTypeId) {
                items.setSelectedType(null)
                items.setSelectedSubType(null)
            } else {
                items.setSelectedType(typeId)
                items.setSelectedSubType(subTypeId)
            }
            items.setUpdateList(true)
            setSideOpened(false)
        }
    }

    const onSubmit = () => {
        if (+priceInputs[0] > +priceInputs[1]) {
            setInputError(true)
        } else {
            setInputError(false)
            items.setSelectedPrice({priceLow: priceInputs[0], priceMax: priceInputs[1]})
            items.setUpdateList(true)
            setSideOpened(false)
        }
    }

    const clearAllFilters = () => {
        if (!items.itemsLoading && ((items.selectedType && items.selectedSubType) || Object.keys(items.selectedPrice).length !== 0)) {
            if (priceInputs) {
                setPriceInputs(['', '']);
            }
            items.setSelectedPrice({})
            items.setSelectedType(null)
            items.setSelectedSubType(null)
            items.setUpdateList(true)
            setSideOpened(false)
        }
    }

    return (
        <motion.li
            variants={variantsLi}
            className="catalog__li"
            onClick={clear ? clearAllFilters : null}
        >
            <motion.div 
                className="catalog__slide-item" 
                onClick={() => setExpanded(isOpen ? false : i)}
            >
                <motion.div 
                    whileHover={{ scale: 1.04 }} 
                    whileTap={{ scale: 1 }} 
                    className="catalog__item"
                >
                    <div className="catalog__slide-name">{name}</div>
                    {price || subType ? <div className={`catalog__slide-icon ${isOpen ? 'rotate' : ''}`}>
                        <img src={downArrow} alt=""/>
                    </div> : null}
                </motion.div>
            </motion.div>
            {!clear && <AnimatePresence initial={false}>
                {isOpen && (price || subType) ? 
                <motion.section
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    className="catalog__section"
                    variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.32, 0.23, 1] }}
                >
                    {subType ? 
                        subType.map((item, i) => {
                            return (
                                <div className="catalog__list-item" key={i} style={{background: items.selectedSubType === item.id ? '#8d59fe' : '#794bb5bf'}}>
                                    <motion.div 
                                        whileHover={{ scale: 1.04 }} 
                                        whileTap={{ scale: 1 }} 
                                        className="catalog__list-text"
                                        onClick={() => changeFilters(typeId, item.id)}
                                    >
                                        <div className="catalog__list-name">{item.name}</div>
                                    </motion.div>
                                </div>
                            )
                        })
                    : price ? 
                        <div className="search__group">
                            <div className="search__inputs">
                                <input 
                                    className="search__input search__input-price" 
                                    onInput={onPriceInputs} 
                                    type="number" name='0' 
                                    value={priceInputs[0]} 
                                    placeholder="Мин"/>
                                <span className="to">до</span>
                                <input
                                    value={priceInputs[1]} 
                                    className="search__input search__input-price" 
                                    onInput={onPriceInputs} 
                                    type="number" name='1' 
                                    placeholder="Макс"/>
                            </div>
                            <div className="search__error" style={{color: inputError ? '#E84D4D' : 'transparent'}}>Введите корректное значение</div>
                            <motion.div
                                className="search__btn"
                                whileHover={{ scale: 1.05, translateY: -3 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onSubmit}
                            >Показать</motion.div>
                        </div>
                    : null}
                </motion.section> : null}
            </AnimatePresence>}
        </motion.li>
    )
})

const sidebar = {
    open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2
    }
    }),
    closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
        delay: 0.4,
        type: "spring",
        stiffness: 400,
        damping: 40
    }
    }
};

const variantsUl = {
    open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
};

const variantsLi = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
};

const Path = props => (
    <motion.path
      fill="transparent"
      strokeWidth="3"
      stroke="#8d59fe"
      strokeLinecap="round"
      {...props}
    />
);

const Sidebar = observer(({setUpdateList}) => {
    const [sideOpened, setSideOpened] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [priceInputs, setPriceInputs] = useState(['', '']);

    const ref = useRef(null);
    const refBtn = useRef(null);
    const height = useRef({ width: 0, height: 0 });

    const {items} = useContext(Context) 

    useEffect(() => {
        if (items.types.length === 0) {
        setLoading(true)
        fetchTypes()
            .then(data => {
                items.setTypes(data)
                setLoading(false)
            })
            .catch(e => {
                setLoading(false)
            })
        }
    }, [])
    
    useEffect(() => {
        height.current.width = ref.current.offsetWidth;
        height.current.height = ref.current.offsetHeight;
    }, []);

    useClickOut(ref, sideOpened, setSideOpened, false, true, false, false, false, true, refBtn);

    const onOpenSidebar = () => {
        setSideOpened(sideOpened => !sideOpened && loading ? sideOpened : !sideOpened)
    }

    const typeList = items.types.map((item, i) => {
        return (
            <LiItems 
                setUpdateList={setUpdateList} 
                typeId={item.id} 
                subType={item.subType.length ? item.subType : false} 
                key={item.id} 
                name={item.name} 
                i={i} 
                setExpanded={setExpanded} 
                expanded={expanded} 
                setSideOpened={setSideOpened}
            />
        )
    })
  
    return (
        <React.Fragment>
        <motion.button ref={refBtn} className="catalog__button" onClick={onOpenSidebar} animate={sideOpened ? "open" : "closed"}>
            <svg width="27" height="27" viewBox="0 0 23 23">
                <Path
                    variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" }
                    }}
                />
                <Path
                    d="M 2 9.423 L 20 9.423"
                    variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                    }}
                    transition={{ duration: 0.1 }}
                />
                <Path
                    variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" }
                    }}
                />
            </svg>
        </motion.button>
        <motion.aside
            className="catalog__nav"
            initial={false}
            variants={{
                closed: { transition: {
                    delay: 0.7
                }, zIndex: -1 },
                open: { zIndex: 10 }
            }}
            animate={sideOpened ? "open" : "closed"}
            custom={height.current}
            ref={ref}
        >
            <motion.div className="background" variants={sidebar} />
            <motion.ul variants={variantsUl} className="catalog__ul">
                {typeList}
                <LiItems 
                    setUpdateList={setUpdateList} 
                    name={'Цена'} 
                    price={true} 
                    i={items.types.length} 
                    setExpanded={setExpanded} 
                    expanded={expanded} 
                    setSideOpened={setSideOpened}
                    priceInputs={priceInputs}
                    setPriceInputs={setPriceInputs}
                />
                <LiItems 
                    setUpdateList={setUpdateList} 
                    name={'Отчистить все'} 
                    clear={true} 
                    i={items.types.length+1} 
                    setExpanded={setExpanded} 
                    expanded={expanded} 
                    setSideOpened={setSideOpened}
                    priceInputs={priceInputs}
                    setPriceInputs={setPriceInputs}
                />
            </motion.ul>
        </motion.aside>
        </React.Fragment>
    );
});

export default Sidebar;
  