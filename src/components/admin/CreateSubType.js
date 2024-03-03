import React, { useState, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { createSubType } from "../../http/itemsApi";
import { useClickOut } from '../../hooks/clickOut.hook';
import { useInputsChange } from '../../hooks/inputs.hook';

import Dropdown from '../dropdown/Dropdown';
import TextInput from '../textInput/TextInput';

import './create.scss';

const SubTypeModal = observer(({modalOpen, refModal, setModalOpen, setShowAnimation, showAnimation}) => {
    const [inputError, setInputError] = useState(false);
    const [input, setInput] = useState('');
    const [typeId, setTypeId] = useState(false);
    const [dropdownCurrent, setDropdownCurrent] = useState(false);

    useClickOut(refModal, modalOpen, false, false, true, setShowAnimation, false, setModalOpen);

    const {items} = useContext(Context);

    const onSubmit = () => {
        if (input === '' || !typeId) {
            setInputError('Заполните все поля')
        } else {
            setInputError(false)

            items.setItemsLoading(true)
            createSubType({id: typeId, name: input.toLowerCase()})
                .then(data => {
                    items.setItemsLoading(false)
                    setShowAnimation(false)
                    setTimeout(() => {
                        setModalOpen(false)
                        document.querySelector('body').style.position = 'relative';
                    }, 400)
                    setInput('')
                    setTypeId(false)
                    setDropdownCurrent(false)
                    items.setUpdateTypes(!items.updateTypes)
                })
                .catch(e => {
                    const errorMessage = e.response.data.message === 'name must be unique' ? 'Название уже существует' : e.response.data.message
                    items.setItemsLoading(false)
                    setInputError(errorMessage)
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
                    dropdownCurrent={dropdownCurrent}
                    setDropdownCurrent={setDropdownCurrent}
                    setInputError={setInputError}
                />
                <TextInput
                    value={input} 
                    onChange={(e) => useInputsChange(e, setInputError, setInput, true)}
                    label="Название подкатегории" 
                    id="subType" 
                    classNames='create__modal-name'
                    name="0"
                />
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{items.typesLoading ? <span className="loader"></span> : "Создать"}</motion.div>
            </div>
        </motion.div>
    )
})

const CreateSubType = () => {
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
                <SubTypeModal 
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
            >Создать Подкатегорию</motion.div>
        </React.Fragment>
    )
}

export default CreateSubType;