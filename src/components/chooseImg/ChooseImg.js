import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useUploadImg } from '../../hooks/uploadImg.hook';
import { handleDragOver, handleDrop } from '../../hooks/DragAndDrop.hook';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import loadingImg from '../../resources/loading.svg';

import './chooseImg.scss';

const ChooseImg = ({rotationAngle, setRotationAngle, setImgFile, setInputError, itemId, itemImg, classNames, changeImg, create = false}) => {
    const [userImageSrc, setUserImageSrc] = useState(false);

    const refImg = useRef(null);

    const onRotate = () => {
        const newRotationAngle = rotationAngle + 90;
        setRotationAngle(newRotationAngle === 360 ? 0 : newRotationAngle);
    };

    return (
        <React.Fragment>
        <div
            className={classNames}
            onDragOver={handleDragOver} 
            onDrop={(e) => create ? handleDrop(e, refImg) : handleDrop(e, refImg, changeImg, setUserImageSrc)}
            onClick={() => document.querySelector('.input-file').click()}
        >
            {changeImg ? 
                <LazyLoadImage
                    key={userImageSrc}
                    width='100%' height='100%'
                    placeholderSrc={loadingImg}
                    effect="blur"
                    src={userImageSrc || `${process.env.REACT_APP_STORAGE_URL}${itemImg}`}
                    ref={refImg}
                    alt='img'
                    className="create__img create__img--opacity"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                />    
            : 
                <img 
                    ref={refImg} 
                    src={userImageSrc ? userImageSrc : ''} 
                    alt="" 
                    className="create__img" 
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                />
            }
            <input 
                className='input-file' 
                type="file" 
                // eslint-disable-next-line react-hooks/rules-of-hooks
                onInput={(e) => create ? useUploadImg(e, refImg, setImgFile, setInputError, false, true) : useUploadImg(e, refImg, setImgFile, setInputError, setUserImageSrc, !changeImg)} 
                id={`img${itemId}`}
            />
            <div className="choose">
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
        </React.Fragment>
    )
}

export default ChooseImg;