import React from 'react';
import { Link } from 'react-router-dom';

import './navBar.scss';

const NavBar = ({scrollToComponent, worksRef, reviewsRef, contactRef}) => {
    return (
        <div className="nav">
            <Link to='/catalog' className="nav__item">Каталог</Link>
            <div className="nav__item" onClick={() => {scrollToComponent(worksRef)}}>Работы</div>
            <div className="nav__item" onClick={() => {scrollToComponent(contactRef)}}>Контакты</div>
            <div className="nav__item" onClick={() => {scrollToComponent(reviewsRef)}}>Отзывы</div>
        </div>
    )
}

export default NavBar;