import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/sideBar/SideBar";
import Catalog from "../components/catalog/Catalog";
import { observer } from "mobx-react-lite";

const CatalogPage = observer(() => {
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