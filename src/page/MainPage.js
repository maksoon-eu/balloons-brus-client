import { useEffect, useContext, useRef } from "react";
import { Context } from "..";
import { fetchTypes, fetchSliderType } from "../http/itemsApi";
import { motion } from "framer-motion";

import NavBar from "../components/navBar/NavBar";
import PopularSlider from "../components/popularSlider/PopularSlider";
import InfoSlider from "../components/infoSlider/InfoSlider";
import SendMessage from "../components/sendMessage/SendMessage";
import MainSlider from "../components/mainSLider/MainSlider";

const MainPage = ({scrollToComponent, contactRef}) => {
    const worksRef = useRef(null);
    const reviewsRef = useRef(null);

    const {items} = useContext(Context);

    useEffect(() => {
        if (items.types.length === 0) {
            items.setTypesLoading(true)
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

            const fetchDataPromise = fetchTypes()
                .then(data => {
                    items.setTypes(data)
                })
                .catch(e => {
                    console.error(e);
                })

            Promise.all([fetchDataPromise, timeoutPromise])
                .finally(() => {
                    items.setTypesLoading(false);
                });
        }
        if (items.sliderTypes.length === 0) {
            fetchSliderType()
                .then(data => {
                    items.setSliderTypes(data)
                })
                .catch(e => {
                })
        }
    }, [])

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        >
            <MainSlider />
            <NavBar scrollToComponent={scrollToComponent} worksRef={worksRef} reviewsRef={reviewsRef} contactRef={contactRef}/>
            <PopularSlider id={1}/>
            <PopularSlider id={2}/>
            <PopularSlider id={3}/>
            <SendMessage />
            <InfoSlider title={'Отзывы клиентов'} store={'reviews'} refs={reviewsRef}/>
            <InfoSlider title={'Наши работы'} store={'works'} refs={worksRef}/>
        </motion.div>
    )
}

export default MainPage;