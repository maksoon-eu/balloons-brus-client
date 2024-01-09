import './navBar.scss';

const NavBar = ({scrollToComponent, worksRef, reviewsRef}) => {
    return (
        <nav className="nav">
            <div className="nav__item" onClick={() => {scrollToComponent(worksRef)}}>Наши работы</div>
            <div className="nav__item">Контакты</div>
            <div className="nav__item">О нас</div>
            <div className="nav__item" onClick={() => {scrollToComponent(reviewsRef)}}>Отзывы</div>
        </nav>
    )
}

export default NavBar;