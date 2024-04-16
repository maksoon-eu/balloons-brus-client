import { useRef, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { changeItem } from '../../http/itemsApi';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { useClickOut } from '../../hooks/clickOut.hook';
import { useInputsChange } from '../../hooks/inputs.hook';

import ChooseImg from '../chooseImg/ChooseImg';

import './changeModal.scss';

const ChangeModal = observer(({changeModal, setChangeModal, item, showAnimation, setShowAnimation}) => {
    const [inputError, setInputError] = useState(false);
    const [imgFile, setImgFile] = useState();
    const [inputs, setInputs] = useState([item.name, item.price, item.description]);
    const [available, setAvailable] = useState(item.available)
    const [loading, setLoading] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0);

    const refChange = useRef(null);

    const {items} = useContext(Context);

    useClickOut(refChange, changeModal, false, false, true, setShowAnimation, setRotationAngle, setChangeModal)

    const onAvailableChange = (bool) => {
        setAvailable(bool)
    }

    const onSubmit = () => {
        if (inputs[0] === '' || inputs[1] === '' || inputs[2] === '') {
            setInputError('Заполните все поля')
        } else {
            setInputError(false)

            const formData = new FormData()
            formData.append('name', inputs[0])
            formData.append('price', inputs[1])
            formData.append('description', inputs[2])
            formData.append('available', available)
            if (imgFile) {
                formData.append('img', imgFile)
            }

            setLoading(true)
            changeItem(item.id, formData, rotationAngle)
                .then(data => {
                    setShowAnimation(false)
                    setTimeout(() => {
                        setChangeModal(false)
                        setRotationAngle(0)
                        document.querySelector('body').style.position = 'relative';
                    }, 400)
                    items.setUpdateList(true)
                    setLoading(false)
                })
                .catch(e => {
                    console.error(e)
                    setLoading(false)
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
            className="change__modal"
            transition={{duration: .4}}
        >
            <div className="change__modal-content" ref={refChange}>
                <ChooseImg
                    rotationAngle={rotationAngle}
                    setRotationAngle={setRotationAngle}
                    setImgFile={setImgFile}
                    setInputError={setInputError}
                    itemId={item.id}
                    itemImg={item.img}
                    classNames={"create__modal-img"}
                    changeImg={true}
                />
                <div className="create__modal-name">
                    <input 
                        className='input-default' 
                        type="text" 
                        id={`name${item.id}`} 
                        required 
                        value={inputs[0]} 
                        name='0' 
                        onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                    />
                    <label className="input-label" htmlFor={`name${item.id}`}>Название товара</label>
                </div>
                <div className="create__modal-price">
                    <input 
                        className='input-default' 
                        type="number" 
                        id={`price${item.id}`} 
                        required 
                        value={inputs[1]} 
                        name='1' 
                        onChange={(e) => useInputsChange(e, setInputError, setInputs)} 
                    />
                    <label className="input-label" htmlFor={`price${item.id}`}>Цена товара</label>
                </div>
                <div className="create__modal-description">
                    <textarea 
                        className='input-default input-textarea input-big' 
                        required 
                        type="text" 
                        id={`description${item.id}`} 
                        value={inputs[2]} 
                        name='2' 
                        onChange={(e) => useInputsChange(e, setInputError, setInputs)}
                    />
                    <label className="input-label" htmlFor={`description${item.id}`}>Описание товара</label>
                </div>
                <div className="create__modal-available">
                    <div className="create__available">Наличие товара</div>
                    <div className="create__available-btns">
                        <motion.div 
                            className="create__available-btn"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.9 }}
                            style={{backgroundColor: available ? '#8d59fe' : '#c6abffa4'}}
                            onClick={() => onAvailableChange(true)}
                        >Да</motion.div>
                        <motion.div 
                            className="create__available-btn"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.9 }}
                            style={{backgroundColor: !available ? '#8d59fe' : '#c6abffa4'}}
                            onClick={() => onAvailableChange(false)}
                        >Нет</motion.div>
                    </div>
                </div>
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>{inputError}</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{loading ? <span className="loader"></span> : "Изменить"}</motion.div>
            </div>
        </motion.div>
    )
})

export default ChangeModal