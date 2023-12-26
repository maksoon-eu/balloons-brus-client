import { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchIdsItem } from '../../http/itemsApi';

import CartItem from '../cartItem/CartItem';

import './cartList.scss';

const CartList = observer(() => {
    const [loading, setLoading] = useState(false)
    const {items} = useContext(Context);

    useEffect(() => {
        if ((items.updateCart || items.cartItems.length === 0) && items.cart.length > 0) {
            setLoading(true)
            const itemsCart = items.cart.map(item => {
                return item[0]
            })

            fetchIdsItem(itemsCart)
                .then(data => {
                    setTimeout(() => {
                    items.setCartItems(data)
                    setLoading(false)
                    items.setUpdateCart(false)
                    }, 3000)
                })
                .catch(e => {
                    setLoading(false)
                    items.setUpdateCart(false)
                })
        }
    }, [items.updateCart])

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

    return (
        <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{opacity: 0}}
                    key={items.itemsLoading === 'loading'}
                    className='cart'
                >
                    {loading ? 'Загрузка...' : 
                    <AnimatePresence mode='popLayout'>
                        {cartList}
                    </AnimatePresence>}
                </motion.div>
            </AnimatePresence>
    )
})

export default CartList;