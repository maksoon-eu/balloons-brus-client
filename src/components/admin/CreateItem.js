import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { createItem } from "../../http/itemsApi";
import { useClickOut } from '../../hooks/clickOut.hook';
import { useInputsChange } from '../../hooks/inputs.hook';

import Dropdown from '../dropdown/Dropdown';
import TextInput from '../textInput/TextInput';
import ChooseImg from '../chooseImg/ChooseImg';

import './create.scss';

const ItemModal = observer(({modalOpen, refModal, setModalOpen, setShowAnimation, showAnimation}) => {
    const [inputError, setInputError] = useState(false);
    const [inputs, setInputs] = useState(['', '', '']);
    const [typeId, setTypeId] = useState(false);
    const [subTypeId, setSubTypeId] = useState([]);
    const [subType, setSubType] = useState([]);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [imgFile, setImgFile] = useState(false);
    const [dropdownTypeCurrent, setDropdownTypeCurrent] = useState(false);
    const [dropdownSubTypeCurrent, setDropdownSubTypeCurrent] = useState(false);

    useClickOut(refModal, modalOpen, false, false, true, setShowAnimation, setRotationAngle, setModalOpen);

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
        items.setItemsLoading(false)
    }, [typeId, modalOpen])

    const onSubmit = () => {
        if (inputs[0] === '' || inputs[1] === '' || inputs[2] === '' || !imgFile || !typeId || !subType) {
            setInputError('Заполните все поля')
        } else {
            setInputError(false)

            const formData = new FormData()
            formData.append('name', inputs[0])
            formData.append('price', inputs[1])
            formData.append('description', inputs[2])
            formData.append('typeId', typeId)
            formData.append('subTypeId', JSON.stringify(subTypeId))
            formData.append('img', imgFile)

            items.setItemsLoading(true)
            createItem(formData, rotationAngle)
                .then(data => {
                    items.setItemsLoading(false)
                    setShowAnimation(false)
                    setTimeout(() => {
                        setModalOpen(false)
                        document.querySelector('body').style.position = 'relative';
                    }, 400)
                    setInputs(['', '', ''])
                    setTypeId(false)
                    setSubTypeId([])
                    setSubType([])
                    setImgFile()
                    setDropdownTypeCurrent(false)
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
            <div className="create__modal-content" ref={refModal}>
                <ChooseImg
                    rotationAngle={rotationAngle}
                    setRotationAngle={setRotationAngle}
                    setImgFile={setImgFile}
                    setInputError={setInputError}
                    itemId={"img"}
                    itemImg={""}
                    classNames={"create__modal-img"}
                    changeImg={false}
                    create={false}
                />
                <TextInput 
                    value={inputs[0]} 
                    onChange={(e) => useInputsChange(e, setInputError, setInputs)} 
                    label="Название товара" 
                    id="name"
                    name="0"
                    classNames='create__modal-name'
                />
                <TextInput 
                    value={inputs[1]} 
                    onChange={(e) => useInputsChange(e, setInputError, setInputs)} 
                    label="Цена товара" 
                    id="price" 
                    classNames='create__modal-price'
                    name="1"
                />
                <div className="create__modal-description">
                    <textarea 
                        className='input-default input-big input-textarea' 
                        required 
                        type="text" 
                        id='description' 
                        value={inputs[2]} 
                        name='2' 
                        onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                    />
                    <label className="input-label" htmlFor="description">Описание товара</label>
                </div>
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
                    multiple={true}
                />
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{items.itemsLoading ? <span className="loader"></span> : "Создать"}</motion.div>
            </div>
        </motion.div>
    )
})

const CreateItem = () => {
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
                <ItemModal 
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
            >Создать Товар</motion.div>
        </React.Fragment>
    )
}

export default CreateItem;