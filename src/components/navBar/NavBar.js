import './navBar.scss';

const NavBar = () => {
    return (
        <nav className="nav">
            <div className="nav__item">Наши работы</div>
            <div className="nav__item">Контакты</div>
            <div className="nav__item">О нас</div>
            <div className="nav__item">Отзывы</div>
        </nav>
    )
}

export default NavBar;