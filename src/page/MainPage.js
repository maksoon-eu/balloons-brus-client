import { useEffect, useContext } from "react";
import { Context } from "..";
import { fetchTypes, fetchSliderType } from "../http/itemsApi";
import { motion } from "framer-motion";

import NavBar from "../components/navBar/NavBar";
import PopularSlider from "../components/popularSlider/PopularSlider";

const MainPage = () => {
    const {items} = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => {
            items.setTypes(data)
        })
        fetchSliderType().then(data => {
            items.setSliderTypes(data)
            items.setTypesLoading(false)
        })
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
        </motion.div>
    )
}

export default MainPage;