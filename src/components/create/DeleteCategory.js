import { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { deleteType } from "../../http/itemsApi";
import downArrow from '../../resources/down-arrow.svg';

import './create.scss';

const Dropdown = observer(({typeList, loading, setState, state, dropdownCurrent, setDropdownCurrent, setInputError}) => {
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
                <div className="dropdown__current-item">{!dropdownCurrent ? 'Выберите категорию' : dropdownCurrent}</div>
                <img src={downArrow} alt="" />
            </div>
            <ul className="dropdown__menu">
                <li onClick={() => {setDropdownCurrent(false); setState(false)}} className={`dropdown__menu-item ${!state ? 'active' : ''}`}>Выберите категорию</li>
                {types}
            </ul>
        </div>
    );
});

const DeleteTypeModal = observer(({modalOpen, refModal, setModalOpen}) => {
    const [inputError, setInputError] = useState(false);
    const [typeId, setTypeId] = useState(false);
    const [dropdownCurrent, setDropdownCurrent] = useState(false);

    const {items} = useContext(Context);

    const onSubmit = () => {
        if (!typeId) {
            setInputError(true)
        } else {
            setInputError(false)
            items.setTypesLoading(true)
            deleteType(typeId)
                .then(data => {
                    items.setTypesLoading(false)
                    setModalOpen(false)
                    setTypeId(false)
                    setDropdownCurrent(false)
                    items.setUpdateTypes(!items.updateTypes)
                })
                .catch(e => {
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
            <div className="create__modal-content create__modal-content-min" ref={refModal}>
                <Dropdown 
                    type="Выберите категорию" 
                    typeList={items.types} 
                    loading={items.typesLoading} 
                    setState={setTypeId} 
                    state={typeId}
                    dropdownCurrent={dropdownCurrent}
                    setDropdownCurrent={setDropdownCurrent}
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

const DeleteType = () => {
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
            <DeleteTypeModal modalOpen={modalOpen} refModal={refModal} setModalOpen={setModalOpen} />
            <motion.div
                whileHover={{ scale: 1.05, translateY: -4 }}
                whileTap={{ scale: 0.9 }}
                className="create__btn"
                onClick={() => setModalOpen(true)}
            >Удалить Категорию</motion.div>
        </>
    )
}

export default DeleteType;