import React, { useEffect, useContext } from "react";
import { Context } from "..";
import { fetchTypes } from "../http/typesApi";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import CreateItem from "../components/admin/CreateItem";
import CreateType from "../components/admin/CreateType";
import CreateSubType from "../components/admin/CreateSubType";
import DeleteType from "../components/admin/DeleteCategory";
import DeleteSubType from "../components/admin/DeleteSubType";

const AdminPage = observer(() => {
    const {types, user} = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isAuth) {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        fetchTypes().then(data => {
            types.setTypes(data)
            types.setTypesLoading(false)
        })
        types.setUpdateList(true)
    }, [types.updateTypes])

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