import React, { useState, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { deleteType } from "../../http/typesApi";
import { useClickOut } from '../../hooks/clickOut.hook';

import Dropdown from '../dropdown/Dropdown';

import './create.scss';

const DeleteTypeModal = observer(({modalOpen, refModal, setModalOpen, setShowAnimation, showAnimation}) => {
    const [inputError, setInputError] = useState(false);
    const [typeId, setTypeId] = useState(false);
    const [dropdownCurrent, setDropdownCurrent] = useState(false);

    useClickOut(refModal, modalOpen, false, false, true, setShowAnimation, false, setModalOpen);

    const {types} = useContext(Context);

    const onSubmit = () => {
        if (!typeId) {
            setInputError('Заполните все поля')
        } else {
            setInputError(false)
            types.setTypesLoading(true)
            deleteType(typeId)
                .then(data => {
                    types.setTypesLoading(false)
                    setShowAnimation(false)
                    setTimeout(() => {
                        setModalOpen(false)
                        document.querySelector('body').style.position = 'relative';
                    }, 400)
                    setTypeId(false)
                    setDropdownCurrent(false)
                    types.setUpdateTypes(!types.updateTypes)
                })
                .catch(e => {
                    console.error(e)
                    types.setTypesLoading(false)
                    setInputError(e.response.data.message)
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
            <div className="create__modal-content create__modal-content-min" ref={refModal}>
                <Dropdown 
                    type="Выберите категорию" 
                    typeList={types.types} 
                    loading={types.typesLoading} 
                    setState={setTypeId} 
                    state={typeId}
                    dropdownCurrent={dropdownCurrent}
                    setDropdownCurrent={setDropdownCurrent}
                    setInputError={setInputError}
                />
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{types.typesLoading ? <span className="loader"></span> : "Удалить"}</motion.div>
            </div>
        </motion.div>
    )
})

const DeleteType = () => {
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
                <DeleteTypeModal 
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
            >Удалить категорию</motion.div>
        </React.Fragment>
    )
}

export default DeleteType;