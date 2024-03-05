import "./aboutInfo.scss";

const AboutInfo = () => {
    return (
        <div className="about">
            <div className="about__title">Доставка</div>
            <p className="about__text">Дорогие друзья, вы можете заказать у нас доставку <span className="about__fill">24/7</span>!*<br/>
            Забрать воздушные шары вы можете и самостоятельно, по адресу <span className="about__fill">ул. Вилюйская 7</span>. С <span className="about__fill">9:00</span> до <span className="about__fill">21:00</span>.</p>

            <p className="about__text">Привезем радость и позитив в любое место, точно в срок!
            <br/>Для заказа звоните или пишите по номеру: <br/><a className="about__tel" href="tel:+79039399494">8-903-939-94-94</a></p>

            <p className="about__text">При оформлении заказа на сайте — с вами свяжется менеджер для обсуждения вариантов оплаты и нюансов заказа в вотсап.</p>

            <p className="about__text">Доставка осуществляется с <span className="about__fill">9:00</span> до <span className="about__fill">21:00</span>, ежедневно, без обеда и выходных.</p>

            <p className="about__text">Стоимость доставки может быть увеличена, в зависимости от удаленности. Точную стоимость уточняйте у оператора.</p>

            <p className="about__text"></p>Минимальная сумма заказа для доставки составляет <span className="about__fill">1000р</span>.

            <p className="about__text">Также вы можете воспользоваться услугами <span className="about__fill">Яндекс Доставки</span> при любой стоимости вашего заказа и вызвать такси с <span className="about__fill">ул. Вилюйской 7</span> до вашего дома, она <span className="about__fill">оплачивается вами лично</span>!</p>

            <div className="about__title">Как заказать доставку шаров?</div>
            <p className="about__text">Заказать доставку гелиевых шаров Вы можете выбрав нужную композицию прямо на сайте. <br/>Либо по телефону: <br/><a className="about__tel" href="tel:+79039399494">8-903-939-94-94</a>
            <br/>Наши операторы помогут вам определиться с выбором, и предложат наиболее удобный способ получения и оплаты заказа.</p>

            <p className="about__text">Так же вы можете оформить заказ, или задать интересующие вопросы  воспользовавшись <span className="about__fill">формой обратной связи</span> на сайте.
            <br/>Необходимо указать <span className="about__fill">имя</span>, <span className="about__fill">номер вашего телефона</span> и <span className="about__fill">пожелания к композиции</span>.</p>
        </div>
    )
}

export default AboutInfo;