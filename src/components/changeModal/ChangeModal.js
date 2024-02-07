import { useRef, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { changeItem } from '../../http/itemsApi';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { useClickOut } from '../../hooks/clickOut.hook';
import { useUploadImg } from '../../hooks/uploadImg.hook';
import { useInputsChange } from '../../hooks/inputs.hook';

import loadingImg from '../../resources/loading.svg';

import './changeModal.scss';

const ChangeModal = observer(({changeModal, setChangeModal, item, showAnimation, setShowAnimation}) => {
    const [inputError, setInputError] = useState(false);
    const [imgFile, setImgFile] = useState()
    const [userImageSrc, setUserImageSrc] = useState(false);
    const [inputs, setInputs] = useState([item.name, item.price, item.description]);
    const [available, setAvailable] = useState(item.available)
    const [loading, setLoading] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0);

    const refChange = useRef(null);
    const refImg = useRef(null);

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
                    setLoading(false)
                    setInputError('Ошибка сервера')
                })
        }
    }

    const onRotate = () => {
        const newRotationAngle = rotationAngle + 90;
        setRotationAngle(newRotationAngle === 360 ? 0 : newRotationAngle);
    };
    
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
                <div className="create__modal-img" onClick={() => document.querySelector('.input-file').click()}>
                    <LazyLoadImage
                        key={userImageSrc}
                        width='100%' height='100%'
                        placeholderSrc={loadingImg}
                        effect="blur"
                        src={userImageSrc || `https://s3.timeweb.com/9f5e65b7-7ed3bc97-902a-48e4-b04a-3554ca39493b/${item.img}`}
                        ref={refImg}
                        alt='img'
                        className="create__img create__img--opacity"
                        style={{ transform: `rotate(${rotationAngle}deg)` }}
                    />
                    <input 
                        className='input-file' 
                        type="file" 
                        onInput={(e) => useUploadImg(e, refImg, setImgFile, setInputError, document.querySelector('.input-file'), setUserImageSrc)} 
                        id={`img${item.id}`}
                    />
                    <div className="create__choose">
                        <svg width="30px" height="26px" viewBox="0 0 22 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Rounded" transform="translate(-713.000000, -2903.000000)">
                                    <g id="Image" transform="translate(100.000000, 2626.000000)">
                                        <g id="-Round-/-Image-/-photo_size_select_actual" transform="translate(612.000000, 274.000000)">
                                            <g transform="translate(0.000000, 0.000000)">
                                                <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                                                <path d="M21,3 L3,3 C2,3 1,4 1,5 L1,19 C1,20.1 1.9,21 3,21 L21,21 C22,21 23,20 23,19 L23,5 C23,4 22,3 21,3 Z M5.63,16.19 L8.12,12.99 C8.32,12.74 8.7,12.73 8.9,12.98 L11,15.51 L14.1,11.52 C14.3,11.26 14.7,11.26 14.9,11.53 L18.41,16.21 C18.66,16.54 18.42,17.01 18.01,17.01 L6.02,17.01 C5.61,17 5.37,16.52 5.63,16.19 Z" id="🔹-Icon-Color" fill="#c6abffa4"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <label className="input-label input-label-img" htmlFor="img">Выберите файл</label>
                </div>
                <motion.div 
                    className="change__modal-rotate"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onRotate}
                >Вращать изображение</motion.div>
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