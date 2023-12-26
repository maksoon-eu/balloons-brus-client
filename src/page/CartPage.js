import { motion } from "framer-motion";
import CartList from "../components/cartList/CartList";

const CartPage = () => {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        >
           <CartList />
        </motion.div>
    )
}

export default CartPage;