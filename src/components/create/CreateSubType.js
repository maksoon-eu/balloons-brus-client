import { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { createSubType } from "../../http/itemsApi";

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

const SubTypeModal = observer(({modalOpen, refModal, setModalOpen}) => {
    const [inputError, setInputError] = useState(false);
    const [input, setInput] = useState('');
    const [typeId, setTypeId] = useState(false);
    const [dropdownCurrent, setDropdownCurrent] = useState(false);

    const {items} = useContext(Context);

    const onInputsChange = (e) => {
        setInputError(false)

        if (e.target.value.charAt(0) === ' ') {
            e.target.value = ''
        }

        setInput(e.target.value)
    }

    const onSubmit = () => {
        if (input === '' || !typeId) {
            setInputError(true)
        } else {
            setInputError(false)

            items.setItemsLoading(true)
            createSubType({id: typeId, name: input})
                .then(data => {
                    items.setItemsLoading(false)
                    setModalOpen(false)
                    setInput('')
                    setTypeId(false)
                    setDropdownCurrent(false)
                    items.setUpdateTypes(!items.updateTypes)
                })
                .catch(e => {
                    console.log(e.message)
                    items.setItemsLoading(false)
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
                    typeList={items.types} 
                    loading={items.typesLoading} 
                    setState={setTypeId} 
                    state={typeId}
                    dropdownCurrent={dropdownCurrent}
                    setDropdownCurrent={setDropdownCurrent}
                    setInputError={setInputError}
                />
                <div className="create__modal-name">
                    <input className='create__input-default' type="text" id='subType' required value={input} onChange={onInputsChange}/>
                    <label className="create__label" htmlFor="subType">Название подкатегории</label>
                </div>
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>Заполните все поля</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{items.typesLoading ? "Loading..." : "Создать"}</motion.div>
            </div>
        </motion.div>
    )
})

const CreateSubType = () => {
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
            <SubTypeModal modalOpen={modalOpen} refModal={refModal} setModalOpen={setModalOpen} />
            <motion.div
                whileHover={{ scale: 1.05, translateY: -4 }}
                whileTap={{ scale: 0.9 }}
                className="create__btn"
                onClick={() => setModalOpen(true)}
            >Создать Подкатегорию</motion.div>
        </>
    )
}

export default CreateSubType;