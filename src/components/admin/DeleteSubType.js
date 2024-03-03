import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { deleteSubType } from "../../http/itemsApi";
import { useClickOut } from '../../hooks/clickOut.hook';

import Dropdown from '../dropdown/Dropdown';

import './create.scss';

const DeleteSubTypeModal = observer(({modalOpen, refModal, setModalOpen, setShowAnimation, showAnimation}) => {
    const [inputError, setInputError] = useState(false);
    const [typeId, setTypeId] = useState(false);
    const [subTypeId, setSubTypeId] = useState(false);
    const [dropdownTypeCurrent, setDropdownTypeCurrent] = useState(false);
    const [subType, setSubType] = useState([]);
    const [dropdownSubTypeCurrent, setDropdownSubTypeCurrent] = useState(false);

    useClickOut(refModal, modalOpen, false, false, true, setShowAnimation, false, setModalOpen);

    const {items} = useContext(Context);

    useEffect(() => {
        setSubType([])
        items.types.forEach(item => {
            if (item.id === typeId) {
                setSubType(item.subType)
            }
        })
        if (!typeId) {
            setSubTypeId([])
            setDropdownSubTypeCurrent(false)
        }
        setDropdownSubTypeCurrent(false)
    }, [typeId, modalOpen])

    const onSubmit = () => {
        if (!typeId || !subTypeId) {
            setInputError('Заполните все поля')
        } else {
            setInputError(false)
            items.setTypesLoading(true)
            deleteSubType(subTypeId)
                .then(data => {
                    items.setTypesLoading(false)
                    setModalOpen(false)
                    document.querySelector('body').style.position = 'relative';
                    setTypeId(false)
                    setSubTypeId(false)
                    setSubType([])
                    setDropdownTypeCurrent(false)
                    setDropdownSubTypeCurrent(false)
                    items.setUpdateTypes(!items.updateTypes)
                })
                .catch(e => {
                    items.setTypesLoading(false)
                    setInputError('Ошибка сервера')
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
            animate={showAnimation ? "open" : "closed"}
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
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{items.typesLoading ? <span className="loader"></span> : "Удалить"}</motion.div>
            </div>
        </motion.div>
    )
})

const DeleteSubType = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    const refModal = useRef(null);

    const onSetModal = () => {
        document.querySelector('body').style.position = 'fixed';
        setModalOpen(true)
        setShowAnimation(true)
    }

    return (
        <React.Fragment>
            {modalOpen && 
                <DeleteSubTypeModal 
                    modalOpen={modalOpen} 
                    refModal={refModal} 
                    setModalOpen={setModalOpen} 
                    showAnimation={showAnimation}
                    setShowAnimation={setShowAnimation}
                />
            }
            <motion.div
                whileHover={{ scale: 1.05, translateY: -4 }}
                whileTap={{ scale: 0.9 }}
                className="create__btn"
                onClick={onSetModal}
            >Удалить подкатегорию</motion.div>
        </React.Fragment>
    )
}

export default DeleteSubType;