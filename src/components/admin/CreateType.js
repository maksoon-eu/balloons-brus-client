import { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { createType } from "../../http/itemsApi";

import './create.scss';

const TypeModal = observer(({modalOpen, refModal, setModalOpen}) => {
    const [inputError, setInputError] = useState(false);
    const [input, setInput] = useState('');

    const {items} = useContext(Context);

    const onInputsChange = (e) => {
        setInputError(false)

        if (e.target.value.charAt(0) === ' ') {
            e.target.value = ''
        }

        setInput(e.target.value)
    }

    const onSubmit = () => {
        if (input === '' ) {
            setInputError('Заполните все поля')
        } else {
            setInputError(false)
            items.setTypesLoading(true)
            createType({name: input})
                .then(data => {
                    items.setTypesLoading(false)
                    setModalOpen(false)
                    setInput('')
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
            animate={modalOpen ? "open" : "closed"}
            className="create__modal"
            transition={{duration: .4}}
        >
            <div className="create__modal-content create__modal-content-min" ref={refModal}>
                <div className="create__modal-name">
                    <input className='input-default' type="text" id='type' required value={input} onChange={onInputsChange}/>
                    <label className="input-label" htmlFor="type">Название категории</label>
                </div>
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

const CreateType = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const refModal = useRef(null);

    useEffect(() => {
        const clickOutElement = (e) => {
            if (modalOpen && refModal.current && !refModal.current.contains(e.target)) {
                setModalOpen(false)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [modalOpen])

    return (
        <>
            <TypeModal modalOpen={modalOpen} refModal={refModal} setModalOpen={setModalOpen} />
            <motion.div
                whileHover={{ scale: 1.05, translateY: -4 }}
                whileTap={{ scale: 0.9 }}
                className="create__btn"
                onClick={() => setModalOpen(true)}
            >Создать Категорию</motion.div>
        </>
    )
}

export default CreateType;