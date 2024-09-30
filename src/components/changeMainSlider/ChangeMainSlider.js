import { useRef, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { changeSlider } from '../../http/sliderApi';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { useClickOut } from '../../hooks/clickOut.hook';

import ChooseImg from '../chooseImg/ChooseImg';

import './changeMainSlider.scss';

const ChangeMainSlider = observer(
    ({ changeModal, setChangeModal, item, showAnimation, setShowAnimation }) => {
        const [inputError, setInputError] = useState(false);
        const [imgFile, setImgFile] = useState();
        const [loading, setLoading] = useState(false);
        const [rotationAngle, setRotationAngle] = useState(0);

        const refChange = useRef(null);

        const { sliders } = useContext(Context);

        useClickOut(
            refChange,
            changeModal,
            false,
            false,
            true,
            setShowAnimation,
            setRotationAngle,
            setChangeModal
        );

        const onSubmit = () => {
            if (imgFile || rotationAngle) {
                const formData = new FormData();
                formData.append('img', imgFile);

                setLoading(true);
                changeSlider(item.id, formData, rotationAngle)
                    .then((data) => {
                        setShowAnimation(false);
                        setTimeout(() => {
                            setChangeModal(false);
                            setRotationAngle(0);
                        }, 400);
                        sliders.setUpdateSliders(true);
                        setLoading(false);
                        setInputError(false);
                    })
                    .catch((e) => {
                        console.error(e);
                        setLoading(false);
                        setInputError(e.response.data.message);
                    });
            }
        };

        return (
            <motion.div
                variants={{
                    open: {
                        opacity: 1,
                        y: 0,
                        display: 'block',
                    },
                    closed: {
                        opacity: 0,
                        y: -100,
                        display: 'none',
                        transition: {
                            display: { delay: 0.4 },
                        },
                    },
                }}
                initial={{ opacity: 0, y: -100 }}
                animate={showAnimation ? 'open' : 'closed'}
                className="change__modal"
                transition={{ duration: 0.4 }}>
                <div className="change__modal-content mainSlider__modal-content" ref={refChange}>
                    <ChooseImg
                        rotationAngle={rotationAngle}
                        setRotationAngle={setRotationAngle}
                        setImgFile={setImgFile}
                        setInputError={setInputError}
                        itemId={item.id}
                        itemImg={item.img}
                        classNames={'create__modal-img mainSlider__modal-img'}
                        changeImg={true}
                    />
                    <span
                        className="create__modal-error"
                        style={{ color: inputError ? '#E84D4D' : 'transparent' }}>
                        {inputError}
                    </span>
                    <motion.div
                        className="create__modal-btn"
                        whileHover={{ scale: 1.05, translateY: -3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onSubmit}>
                        {loading ? <span className="loader"></span> : 'Изменить'}
                    </motion.div>
                </div>
            </motion.div>
        );
    }
);

export default ChangeMainSlider;
