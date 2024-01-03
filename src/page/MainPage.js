import { useEffect, useContext } from "react";
import { Context } from "..";
import { fetchTypes, fetchSliderType } from "../http/itemsApi";
import { motion } from "framer-motion";

import NavBar from "../components/navBar/NavBar";
import PopularSlider from "../components/popularSlider/PopularSlider";
import InfoSlider from "../components/infoSlider/InfoSlider";

const MainPage = () => {
    const {items} = useContext(Context)

    useEffect(() => {
        if (items.types.length === 0) {
        items.setTypesLoading(true)
        fetchTypes()
            .then(data => {
                setTimeout(() => {
                    items.setTypes(data)
                    items.setTypesLoading(false)
                }, 5000)
            })
            .catch(e => {
                items.setTypesLoading(false)
            })
        }
        if (items.sliderTypes.length === 0) {
        fetchSliderType()
            .then(data => {
                setTimeout(() => {
                    items.setSliderTypes(data)
                }, 1000)
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
            <NavBar/>
            <PopularSlider id={1}/>
            <PopularSlider id={2}/>
            <PopularSlider id={3}/>
            <InfoSlider title={'Отзывы клиентов'} store={'reviews'} />
            <InfoSlider title={'Наши работы'} store={'works'} />
        </motion.div>
    )
}

export default MainPage;