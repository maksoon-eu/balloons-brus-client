import { motion } from "framer-motion";
import Sidebar from "../components/sideBar/SideBar";
import Catalog from "../components/catalog/Catalog";
import { useEffect, useContext } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const CatalogPage = observer(() => {
    const {items} = useContext(Context)
    
    useEffect(() => {
        console.log(items.itemsLoading)
        if (!items.itemsLoading) {
            const scrollPosition = sessionStorage.getItem('scrollPosition');
            if (scrollPosition) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(scrollPosition, 10));
                    sessionStorage.removeItem('scrollPosition');
                }, 350)
            }
        }
    }, [items.itemsLoading]);

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="catalog"
        >
            <Sidebar/>
            <Catalog/>
        </motion.div>
    )
})

export default CatalogPage;