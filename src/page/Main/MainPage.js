import { useEffect, useContext, useRef } from 'react';
import { Context } from '../..';
import { fetchTypes, fetchSliderType } from '../../http/typesApi';

import NavBar from '../../components/navBar/NavBar';
import PopularSlider from '../../components/popularSlider/PopularSlider';
import InfoSlider from '../../components/infoSlider/InfoSlider';
import SendMessage from '../../components/sendMessage/SendMessage';
import MainSlider from '../../components/mainSLider/MainSlider';
import Smooth from '../../components/smooth/Smooth';

const MainPage = ({ scrollToComponent, contactRef }) => {
    const worksRef = useRef(null);
    const reviewsRef = useRef(null);

    const { types } = useContext(Context);

    useEffect(() => {
        if (types.types.length === 0) {
            types.setTypesLoading(true);
            const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1000));

            const fetchDataPromise = fetchTypes()
                .then((data) => {
                    types.setTypes(data);
                })
                .catch((e) => {
                    console.error(e);
                });

            Promise.all([fetchDataPromise, timeoutPromise]).finally(() => {
                types.setTypesLoading(false);
            });
        }
        if (types.sliderTypes.length === 0) {
            fetchSliderType()
                .then((data) => {
                    types.setSliderTypes(data);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    }, []);

    return (
        <Smooth>
            <MainSlider />
            <NavBar
                scrollToComponent={scrollToComponent}
                worksRef={worksRef}
                reviewsRef={reviewsRef}
                contactRef={contactRef}
            />
            <PopularSlider id={1} />
            <PopularSlider id={2} />
            <PopularSlider id={3} />
            <SendMessage />
            <InfoSlider title={'Отзывы клиентов'} store={'reviews'} refs={reviewsRef} />
            <InfoSlider title={'Наши работы'} store={'works'} refs={worksRef} />
        </Smooth>
    );
};

export default MainPage;
