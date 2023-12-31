import { motion } from "framer-motion";
import CartList from "../components/cartList/CartList";
import OrderModal from "../components/orderModal/OrderModal";

const CartPage = () => {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        >
            <div className="cart__title">Корзина</div>
            <div className="cart">
                <CartList />
                <OrderModal />
            </div>
        </motion.div>
    )
}

export default CartPage;