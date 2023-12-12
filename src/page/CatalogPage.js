import { motion } from "framer-motion";
import Sidebar from "../components/sideBar/SideBar";
import Catalog from "../components/catalog/Catalog";
import { useEffect, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const CatalogPage = observer(() => {
    const [updateList, setUpdateList] = useState(false);

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="catalog"
        >
            <Sidebar setUpdateList={setUpdateList}/>
            <Catalog updateList={updateList} setUpdateList={setUpdateList}/>
        </motion.div>
    )
})

export default CatalogPage;