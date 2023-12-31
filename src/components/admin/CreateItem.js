import { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { createItem } from "../../http/itemsApi";

import downArrow from '../../resources/down-arrow.svg';

import './create.scss';

const Dropdown = observer(({type, typeList, loading, setState, state, dropdownCurrent, setDropdownCurrent, setInputError}) => {
    const [dropdownToggle, setDropdownToggle] = useState(false);

    const ref = useRef(null)

    useEffect(() => {
        const clickOutElement = (e) => {
            if (dropdownToggle && ref.current && !ref.current.contains(e.target)) {
                setDropdownToggle(false)
            }
        }
    
        document.addEventListener("mousedown", clickOutElement)
    
        return function() {
          document.removeEventListener("mousedown", clickOutElement)
        }
    }, [dropdownToggle])

    const onDropdownActive = () => {
        if (!loading) {
            setInputError(false)
            setDropdownToggle(dropdownToggle => !dropdownToggle)
        }
    }

    const onSetCurrentDropdown = (e, id) => {
        setState(state => state === id ? false : id)
        setDropdownCurrent(dropdownCurrent === e.currentTarget.textContent ? false : e.currentTarget.textContent)
        setDropdownToggle(false)
    }

    const types = typeList.map(item => {
        return (
            <li key={item.id} onClick={(e) => onSetCurrentDropdown(e, item.id)} className={`dropdown__menu-item ${state === item.id ? 'active' : ''}`}>{item.name}</li>
        )
    })

    return (
        <div ref={ref} className={`dropdown ${dropdownToggle ? 'active' : ''}`} tabIndex="1">
            <div className="dropdown__current" onClick={onDropdownActive}>
                <div className="dropdown__current-item">{!dropdownCurrent ? type : dropdownCurrent}</div>
                <img src={downArrow} alt="" />
            </div>
            <ul className="dropdown__menu">
                <li onClick={() => {setDropdownCurrent(false); setState(false)}} className={`dropdown__menu-item ${!state ? 'active' : ''}`}>{type}</li>
                {types.length ? types : <div className="dropdown__menu-item">Подкатегории отсутствуют</div>}
            </ul>
        </div>
    );
});

const ItemModal = observer(({modalOpen, refModal, setModalOpen}) => {
    const [inputError, setInputError] = useState(false);
    const [inputs, setInputs] = useState(['', '', '']);
    const [typeId, setTypeId] = useState(false);
    const [subTypeId, setSubTypeId] = useState(false);
    const [subType, setSubType] = useState([]);
    const [imgFile, setImgFile] = useState()
    const [dropdownTypeCurrent, setDropdownTypeCurrent] = useState(false);
    const [dropdownSubTypeCurrent, setDropdownSubTypeCurrent] = useState(false);

    const refImg = useRef(null);

    const {items} = useContext(Context);

    useEffect(() => {
        items.types.forEach(item => {
            if (item.id === typeId) {
                setSubType(item.subType)
            }
        })
        setDropdownSubTypeCurrent(false)
        items.setItemsLoading(false)
    }, [typeId, modalOpen])

    const onInputsChange = (e) => {
        setInputError(false)

        if (e.target.value.charAt(0) === ' ') {
            e.target.value = ''
        }

        setInputs(inputs => inputs.map((item, i) => i === +e.target.name ? e.target.value : item))
    }

    const onSubmit = () => {
        if (inputs[0] === '' || inputs[1] === '' || inputs[2] === '' || refImg.current.currentSrc === '' || !typeId || !subType) {
            setInputError(true)
        } else {
            setInputError(false)

            const formData = new FormData()
            formData.append('name', inputs[0])
            formData.append('price', inputs[1])
            formData.append('description', inputs[2])
            formData.append('typeId', typeId)
            if (subTypeId) {
                formData.append('subTypeId', subTypeId)
            }
            formData.append('img', imgFile)

            items.setItemsLoading(true)
            createItem(formData)
                .then(data => {
                    setTimeout(() => {
                    items.setItemsLoading(false)
                    setModalOpen(false)
                    setInputs(['', '', ''])
                    setTypeId(false)
                    setSubTypeId(false)
                    setSubType([])
                    setImgFile()
                    refImg.current.setAttribute("src", "")
                    refImg.current.style.opacity = 0;
                    setDropdownTypeCurrent(false)
                    document.querySelector('.input-label').style.transform = 'translateY(0) translateX(-50%) scale(1)'
                    }, 3000)
                })
                .catch(e => {
                    console.log(e.message)
                    items.setItemsLoading(false)
                    setInputError(true)
                })
        }
    }

    const previewFile = (e, inputImg) => {
        const file = e.target.files[0];
        setImgFile(e.target.files[0])
    
        if (file) {
            const reader = new FileReader();
        
            reader.onload = function() {
                inputImg.current.setAttribute("src", reader.result);
            }
        
            reader.readAsDataURL(file);
            inputImg.current.style.opacity = 1;
            document.querySelector('.input-label').style.transform = 'translateY(-965%) translateX(-125%) scale(.7)'
            setInputError(false)
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
            <div className="create__modal-content" ref={refModal}>
                <div className="create__modal-img" onClick={() => document.querySelector('.input-file').click(() => console.log('click'))}>
                    <img ref={refImg} src="" alt="" className="create__img"/>
                    <input className='input-file' type="file" onInput={(e) => previewFile(e, refImg)} id='img'/>
                    <div className="create__choose">
                        <svg width="30px" height="26px" viewBox="0 0 22 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Rounded" transform="translate(-713.000000, -2903.000000)">
                                    <g id="Image" transform="translate(100.000000, 2626.000000)">
                                        <g id="-Round-/-Image-/-photo_size_select_actual" transform="translate(612.000000, 274.000000)">
                                            <g transform="translate(0.000000, 0.000000)">
                                                <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                                                <path d="M21,3 L3,3 C2,3 1,4 1,5 L1,19 C1,20.1 1.9,21 3,21 L21,21 C22,21 23,20 23,19 L23,5 C23,4 22,3 21,3 Z M5.63,16.19 L8.12,12.99 C8.32,12.74 8.7,12.73 8.9,12.98 L11,15.51 L14.1,11.52 C14.3,11.26 14.7,11.26 14.9,11.53 L18.41,16.21 C18.66,16.54 18.42,17.01 18.01,17.01 L6.02,17.01 C5.61,17 5.37,16.52 5.63,16.19 Z" id="🔹-Icon-Color" fill="#c5abff"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <label className="input-label input-label-img" htmlFor="img">Выберите файл</label>
                </div>
                <div className="create__modal-name">
                    <input className='input-default' type="text" id='name' required value={inputs[0]} name='0' onChange={onInputsChange}/>
                    <label className="input-label" htmlFor="name">Название товара</label>
                </div>
                <div className="create__modal-price">
                    <input className='input-default' type="number" id='price' required value={inputs[1]} name='1' onChange={onInputsChange} />
                    <label className="input-label" htmlFor="price">Цена товара</label>
                </div>
                <div className="create__modal-description">
                    <input className='input-default input-big' required type="text" id='description' value={inputs[2]} name='2' onChange={onInputsChange}/>
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
                />
                <span className='create__modal-error' style={{color: inputError ? '#E84D4D' : 'transparent'}}>Заполните все поля</span>
                <motion.div
                    className="create__modal-btn"
                    whileHover={{ scale: 1.05, translateY: -3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                >{items.itemsLoading ? "Loading..." : "Создать"}</motion.div>
            </div>
        </motion.div>
    )
})

const CreateItem = () => {
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
            <ItemModal modalOpen={modalOpen} refModal={refModal} setModalOpen={setModalOpen} />
            <motion.div
                whileHover={{ scale: 1.05, translateY: -4 }}
                whileTap={{ scale: 0.9 }}
                className="create__btn"
                onClick={() => setModalOpen(true)}
            >Создать Товар</motion.div>
        </>
    )
}

export default CreateItem;