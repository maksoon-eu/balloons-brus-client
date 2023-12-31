import { useEffect, useContext } from "react";
import { Context } from "..";
import { fetchTypes } from "../http/itemsApi";
import { motion } from "framer-motion";

import CreateItem from "../components/admin/CreateItem";
import CreateType from "../components/admin/CreateType";
import CreateSubType from "../components/admin/CreateSubType";
import DeleteType from "../components/admin/DeleteCategory";
import DeleteSubType from "../components/admin/DeleteSubType";
import { observer } from "mobx-react-lite";

const AdminPage = observer(() => {
    const {items} = useContext(Context);

    useEffect(() => {
        fetchTypes().then(data => {
            items.setTypes(data)
            items.setTypesLoading(false)
        })
        items.setUpdateList(true)
    }, [items.updateTypes])

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="create"
        >
            <div className="create__flex">
                <CreateItem/>
                <CreateType/>
                <CreateSubType/>
                <DeleteType/>
                <DeleteSubType/>
            </div>
        </motion.div>
    )
})

export default AdminPage;