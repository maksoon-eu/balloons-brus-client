import { useContext, useEffect } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchIdsItem } from '../../http/itemsApi';
import SkeletonCart from '../skeleton/SkeletonCart';

import CartItem from '../cartItem/CartItem';

import './cartList.scss';

const CartList = observer(() => {
    const {items} = useContext(Context);

    const skeleton = ['', '', '', ''];

    useEffect(() => {
        if ((items.updateCart || items.cartItems.length === 0) && items.cart.length > 0) {
            items.setCartLoading(true);
            const itemsCart = items.cart.map(item => {
                return item[0];
            });
    
            fetchIdsItem(itemsCart)
                .then(data => {
                    setTimeout(() => {
                        items.setCartItems(data);
                        items.setCartLoading(false);
                        items.setUpdateCart(false);
                    }, 3000);
                })
                .catch(e => {
                    items.setCartLoading(false);
                    items.setUpdateCart(false);
                });
        } else {
            items.setCartLoading(false);
        }
    }, [items.updateCart]);

    const cartList = items.cartItems.map(item => {
        return (
            <motion.li
            layout
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring" }}
            className="cartItem"
            key={item.id}
        >
            <CartItem item={item} />
        </motion.li>
        )
    })

    const skeletonList = skeleton.map((item, i) => {
        return (
            <SkeletonCart key={i} />
        )
    })

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                exit={{opacity: 0}}
                key={items.cartLoading}
                className='cart__inner'
            >
                {items.cartLoading ? skeletonList : items.cartItems.length === 0 ? <div className='cart__void'>Корзина пуста</div> :
                <AnimatePresence mode='popLayout'>
                    {cartList}
                </AnimatePresence>}
            </motion.div>
        </AnimatePresence>
    )
})

export default CartList;