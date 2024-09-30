import CartList from '../../components/cartList/CartList';
import OrderModal from '../../components/orderModal/OrderModal';
import Smooth from '../../components/smooth/Smooth';

const CartPage = () => {
    return (
        <Smooth>
            <div className="cart__title">Корзина</div>
            <div className="cart">
                <CartList />
                <OrderModal />
            </div>
        </Smooth>
    );
};

export default CartPage;
