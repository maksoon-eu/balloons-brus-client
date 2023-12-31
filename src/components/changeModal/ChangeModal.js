import { useEffect, useRef, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { changeItem } from '../../http/itemsApi';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

import './changeModal.scss';

const ChangeModal = observer(({changeModal, setChangeModal, item, showAnimation, setShowAnimation}) => {
    const [inputError, setInputError] = useState(false);
    const [userImageSrc, setUserImageSrc] = useState(false);
    const [imgFile, setImgFile] = useState()
    const [inputs, setInputs] = useState([item.name, item.price, item.description]);
    const [available, setAvailable] = useState(item.available)
    const [loading, setLoading] = useState(false);

    const refChange = useRef(null);

    const {items} = useContext(Context);

    useEffect(() => {
        const clickOutElement = (e) => {
            if (changeModal && refChange.current && !refChange.current.contains(e.target)) {
                setShowAnimation(false)
                setTimeout(() => {
                    setChangeModal(false)
                }, 400)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [changeModal])

    const onInputsChange = (e) => {
        setInputError(false)

        if (e.target.value.charAt(0) === ' ') {
            e.target.value = ''
        }

        setInputs(inputs => inputs.map((item, i) => i === +e.target.name ? e.target.value : item))
    }
    const onAvailableChange = (bool) => {
        setAvailable(bool)
    }

    const previewFile = (event) => {
        const file = event.target.files[0];
        setImgFile(event.target.files[0]);
    
        if (file) {
            const reader = new FileReader();
        
            reader.onload = function() {
                setUserImageSrc(reader.result);
            }
        
            reader.readAsDataURL(file);
            document.querySelector('.create__label').style.transform = 'translateY(-965%) translateX(-125%) scale(.7)'
            setInputError(false)
        }
    };

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
            if (userImageSrc) {
                formData.append('img', imgFile)
            }

            setLoading(true)
            changeItem(item.id, formData)
                .then(data => {
                    setTimeout(() => {
                    setShowAnimation(false)
                    setTimeout(() => {
                        setChangeModal(false)
                    }, 400)
                    items.setUpdateList(true)
                    setLoading(false)
                    }, 3000)
                })
                .catch(e => {
                    setLoading(false)
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
            className="change__modal"
            transition={{duration: .4}}
        >
            <div className="change__modal-content" ref={refChange}>
                <div className="create__modal-img" onClick={() => document.querySelector('.input-file').click()}>
                    <LazyLoadImage
                        key={userImageSrc}
                        width='100%' height='100%'
                        placeholderSrc={loading}
                        effect="opacity"
                        src={userImageSrc || `http://localhost:4000/${item.img}`}
                        crossOrigin="anonymous"
                        alt='img'
                        className="create__img create__img--opacity"
                    />
                    <input className='input-file' type="file" onInput={previewFile} id={`img${item.id}`}/>
                    <label className="create__label create__label-img create__label--opacity" htmlFor={`img${item.id}`}>Выберите файл</label>
                </div>
                <div className="create__modal-name">
                    <input className='input-default' type="text" id={`name${item.id}`} required value={inputs[0]} name='0' onChange={onInputsChange}/>
                    <label className="input-label" htmlFor={`name${item.id}`}>Название товара</label>
                </div>
                <div className="create__modal-price">
                    <input className='input-default' type="number" id={`price${item.id}`} required value={inputs[1]} name='1' onChange={onInputsChange} />
                    <label className="input-label" htmlFor={`price${item.id}`}>Цена товара</label>
                </div>
                <div className="create__modal-description">
                    <input className='input-default input-big' required type="text" id={`description${item.id}`} value={inputs[2]} name='2' onChange={onInputsChange}/>
                    <label className="input-label" htmlFor={`description${item.id}`}>Описание товара</label>
                </div>
                <div className="create__modal-available">
                    <div className="create__available">Наличие товара</div>
                    <div className="create__available-btns">
                        <motion.div 
                            className="create__available-btn"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.9 }}
                            style={{backgroundColor: available ? '#8d59fe' : '#c5abff'}}
                            onClick={() => onAvailableChange(true)}
                        >Да</motion.div>
                        <motion.div 
                            className="create__available-btn"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.9 }}
                            style={{backgroundColor: !available ? '#8d59fe' : '#c5abff'}}
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