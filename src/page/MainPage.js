import { useEffect, useContext, useRef } from "react";
import { Context } from "..";
import { fetchTypes, fetchSliderType } from "../http/itemsApi";
import { motion } from "framer-motion";

import NavBar from "../components/navBar/NavBar";
import PopularSlider from "../components/popularSlider/PopularSlider";
import InfoSlider from "../components/infoSlider/InfoSlider";
import SendMessage from "../components/sendMessage/SendMessage";

const MainPage = ({scrollToComponent, contactRef}) => {
    const worksRef = useRef(null);
    const reviewsRef = useRef(null);

    const {items} = useContext(Context);

    useEffect(() => {
        if (items.types.length === 0) {
        items.setTypesLoading(true)
        fetchTypes()
            .then(data => {
                items.setTypes(data)
                items.setTypesLoading(false)
            })
            .catch(e => {
                items.setTypesLoading(false)
            })
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