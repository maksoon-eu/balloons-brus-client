import { useEffect, useRef, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { changeSlider } from '../../http/sliderApi';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

import './changeMainSlider.scss';

const ChangeMainSlider = observer(({changeModal, setChangeModal, item, showAnimation, setShowAnimation}) => {
    const [inputError, setInputError] = useState(false);
    const [userImageSrc, setUserImageSrc] = useState(false);
    const [imgFile, setImgFile] = useState()
    const [loading, setLoading] = useState(false);

    const refChange = useRef(null);

    const {sliders} = useContext(Context);

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

    const previewFile = (event) => {
        const file = event.target.files[0];
        setImgFile(event.target.files[0]);
    
        if (file) {
            const reader = new FileReader();
        
            reader.onload = function() {
                setUserImageSrc(reader.result);
            }
        
            reader.readAsDataURL(file);
            setInputError(false)
        }
    };

    const onSubmit = () => {
        const formData = new FormData()
        formData.append('img', imgFile)

        setLoading(true)
        changeSlider(item.id, formData)
            .then(data => {
                setShowAnimation(false)
                setTimeout(() => {
                    setChangeModal(false)
                }, 400)
                sliders.setUpdateSliders(true)
                setLoading(false)
                setInputError(false)
            })
            .catch(e => {
                setLoading(false)
                setInputError('Ошибка сервера')
            })
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
            <div className="change__modal-content mainSlider__modal-content" ref={refChange}>
                <div className="create__modal-img mainSlider__modal-img" onClick={() => document.querySelector('.input-file').click()}>
                    <LazyLoadImage
                        key={userImageSrc}
                        width='100%' height='100%'
                        placeholderSrc={loading}
                        effect="opacity"
                        src={userImageSrc || `https://s3.timeweb.com/9f5e65b7-7ed3bc97-902a-48e4-b04a-3554ca39493b/${item.img}`}
                        crossOrigin="anonymous"
                        alt='img'
                        className="create__img create__img--opacity mainSlider__img"
                    />
                    <input className='input-file' type="file" onInput={previewFile} id={`img${item.id}`}/>
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

export default ChangeMainSlider;