import React, { useState, useRef, useEffect, useContext } from 'react';
import { observer } from "mobx-react-lite";
import { useClickOut } from '../../hooks/clickOut.hook';
import { Context } from '../..';

import downArrow from '../../resources/down-arrow.svg';

import './dropdown.scss';

const Dropdown = observer(({type, typeList, loading, setState, state, dropdownCurrent, setDropdownCurrent, setInputError = false, multiple = false, subTypeId = null, setSubTypeId = null, setUpdateList = false, slider = false}) => {
    const [dropdownToggle, setDropdownToggle] = useState(false);

    const {items} = useContext(Context);

    const ref = useRef(null)

    useClickOut(ref, dropdownToggle, setDropdownToggle)

    useEffect(() => {
        if (multiple) {
            setDropdownCurrent(state.length === 0 ? false : `Выбрано ${state.length}`)
        }
    }, [state, setState])

    const onDropdownActive = () => {
        if (!loading) {
            if ((slider && !items.typeLoading) || !slider) {
                if (setInputError) {
                    setInputError(false)
                }
                setDropdownToggle(dropdownToggle => !dropdownToggle)
            }
        }
    }

    const onSetCurrentDropdown = (e, id) => {
        if (slider && type === 'Категория' && subTypeId && setSubTypeId) {
            setSubTypeId(null)
        }

        if (multiple) {
            if (state.includes(id)) {
                setState(state.filter(item => item !== id))
            } else {
                setState([...state, id])
            }
            setDropdownToggle(false)
        } else {
            setState(state => state === id ? null : id)
            setDropdownCurrent(dropdownCurrent === e.currentTarget.textContent ? false : e.currentTarget.textContent)
            setDropdownToggle(false)
            if (setUpdateList) {
                setUpdateList(true)
            }
        }
    }

    const types = typeList.map(item => {
        return (
            <li key={item.id} onClick={(e) => onSetCurrentDropdown(e, item.id)} className={`dropdown__menu-item ${multiple ? (state.includes(item.id) ? 'active' : '') : (state === item.id ? 'active' : '')}`}>{item.name}</li>
        )
    })

    return (
        <div ref={ref} className={`dropdown ${dropdownToggle ? 'active' : ''}`} tabIndex="1">
            <div className="dropdown__current" onClick={onDropdownActive}>
                <div className="dropdown__current-item">{!dropdownCurrent ? type : dropdownCurrent}</div>
                <img src={downArrow} alt="" />
            </div>
            <ul className="dropdown__menu">
                <li 
                    onClick={() => {setDropdownCurrent(false); setState(multiple ? [] : null)}} 
                    className={`dropdown__menu-item ${multiple ? (state.length === 0 ? 'active' : '') : (!state ? 'active' : '')}`}>{type}
                </li>
                {types.length ? types : <div className="dropdown__menu-item">Подкатегории отсутствуют</div>}
            </ul>
        </div>
    );
});

export default Dropdown;