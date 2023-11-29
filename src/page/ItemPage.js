import { motion } from "framer-motion";

const ItemPage = () => {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        >
            Item
        </motion.div>
    )
}

export default ItemPage;