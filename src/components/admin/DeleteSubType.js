import { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { deleteSubType } from "../../http/itemsApi";
import downArrow from '../../resources/down-arrow.svg';

import './create.scss';

const Dropdown = observer(({type, typeList, loading, setState, state, dropdownCurrent, setDropdownCurrent, setInputError}) => {
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
            setInputError(false)
            setDropdownToggle(dropdownToggle => !dropdownToggle)
        }
    }

    const onSetCurrentDropdown = (e, id) => {
        setState(state => state === id ? false : id)
        setDropdownCurrent(dropdownCurrent === e.currentTarget.textContent ? false : e.currentTarget.textContent)
        setDropdownToggle(false)
    }

    const types = typeList.map(item => {
        return (
            <li key={item.id} onClick={(e) => onSetCurrentDropdown(e, item.id)} className={`dropdown__menu-item ${state === item.id ? 'active' : ''}`}>{item.name}</li>
        )
    })

    return (
        <div ref={ref} className={`dropdown ${dropdownToggle ? 'active' : ''}`} tabIndex="1">
            <div className="dropdown__current" onClick={onDropdownActive}>
                <div className="dropdown__current-item">{!dropdownCurrent ? type : dropdownCurrent}</div>
                <img src={downArrow} alt="" />
            </div>
            <ul className="dropdown__menu">
                <li onClick={() => {setDropdownCurrent(false); setState(false)}} className={`dropdown__menu-item ${!state ? 'active' : ''}`}>{type}</li>
                {types}
            </ul>
        </div>
    );
});

const DeleteSubTypeModal = observer(({modalOpen, refModal, setModalOpen}) => {
    const [inputError, setInputError] = useState(false);
    const [typeId, setTypeId] = useState(false);
    const [subTypeId, setSubTypeId] = useState(false);
    const [dropdownTypeCurrent, setDropdownTypeCurrent] = useState(false);
    const [subType, setSubType] = useState([]);
    const [dropdownSubTypeCurrent, setDropdownSubTypeCurrent] = useState(false);

    const {items} = useContext(Context);

    useEffect(() => {
        items.types.forEach(item => {
            if (item.id === typeId) {
                setSubType(item.subType)
            }
        })
        setDropdownSubTypeCurrent(false)
    }, [typeId, modalOpen])

    const onSubmit = () => {
        if (!typeId || !subTypeId) {
            setInputError(true)
        } else {
            setInputError(false)
            items.setTypesLoading(true)
            deleteSubType(subTypeId)
                .then(data => {
                    items.setTypesLoading(false)
                    setModalOpen(false)
                    setTypeId(false)
                    setSubTypeId(false)
                    setSubType([])
                    setDropdownTypeCurrent(false)
                    setDropdownSubTypeCurrent(false)
                    items.setUpdateTypes(!items.updateTypes)
                })
                .catch(e => {
                    console.log(e.message)
                    items.setTypesLoading(false)
                    setInputError(true)
                })
        }
    }

    return (
        <motion.div 
            variants={{
                open: {
                    opacity: 1,
                    y: 0,
                    display: 'block'
                },
                closed: {
                    opacity: 0,
                    y: -100,
                    display: 'none',
                    transition: {
                        display: {delay: .4}
                    }
                }
            }}
            initial={{opacity: 0, y: -100}}
            animate={modalOpen ? "open" : "closed"}
            className="create__modal"
            transition={{duration: .4}}
        >
            <div className="create__modal-content create__modal-content-middle" ref={refModal}>
            <Dropdown 
                    type="Выберите категорию" 
                    typeList={items.types} 
                    loading={items.typesLoading} 
                    setState={setTypeId} 
                    state={typeId}
                    dropdownCurrent={dropdownTypeCurrent}
                    setDropdownCurrent={setDropdownTypeCurrent}
                    setInputError={setInputError}
                />
                <Dropdown 
                    type="Выберите подкатегорию" 
                    typeList={subType} 
                    loading={items.typesLoading} 
                    setState={setSubTypeId} 
                    state={subTypeId}
                    dropdownCurrent={dropdownSubTypeCurrent}
                    setDropdownCurrent={setDropdownSubTypeCurrent}
                    setInputError={setInputError}
                />
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>Заполните поле</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{items.typesLoading ? "Loading..." : "Удалить"}</motion.div>
            </div>
        </motion.div>
    )
})

const DeleteSubType = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const refModal = useRef(null);

    useEffect(() => {
        const clickOutElement = (e) => {
            if (modalOpen && refModal.current && !refModal.current.contains(e.target)) {
                setModalOpen(false)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [modalOpen])

    return (
        <>
            <DeleteSubTypeModal modalOpen={modalOpen} refModal={refModal} setModalOpen={setModalOpen} />
            <motion.div
                whileHover={{ scale: 1.05, translateY: -4 }}
                whileTap={{ scale: 0.9 }}
                className="create__btn"
                onClick={() => setModalOpen(true)}
            >Удалить подкатегорию</motion.div>
        </>
    )
}

export default DeleteSubType;