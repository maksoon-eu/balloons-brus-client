export const addToCart = (id, count, price, items, bag = false) => {
    const cart = localStorage.getItem('cart')
    if (!cart) {
        localStorage.setItem('cart', JSON.stringify([[id, count, price]]))
    } else {
        if (JSON.parse(cart).some(item => item[0] === id)) {
            if (JSON.parse(cart).some(item => item[1] === count)) {
                localStorage.setItem('cart', JSON.stringify(JSON.parse(cart).filter(item => item[0] !== id)));
                if (bag) {
                    items.setCartItems(items.cartItems.filter(item => item.id !== id))
                    items.setCart(JSON.parse(localStorage.getItem('cart')))
                    return;
                }
            } else {
                const data = JSON.parse(cart);
                data.forEach(item => {
                    if (item[0] === id) {
                        item[1] = count;
                    }
                });
                localStorage.setItem('cart', JSON.stringify(data));
                if (bag) {
                    items.setCart(JSON.parse(localStorage.getItem('cart')))
                    return;
                }
            }
        } else {
            localStorage.setItem('cart', JSON.stringify([...JSON.parse(cart), [id, count, price]]))
        }
    }
    items.setCart(JSON.parse(localStorage.getItem('cart')))
    items.setUpdateCart(true)
}

export const calcPlus = (flag, items, setCount, item, count, bag = false) => {
    if (flag !== -1) {
        if (items.cart[flag][1] > 0) {
            setCount(items.cart[flag][1] + 1)
            addToCart(item.id, items.cart[flag][1]+1, item.price, items, bag)
        }
    } else {
        if (count > 0) {
            setCount(count => count + 1)
        }
    }
}

export const calcMinus = (flag, items, setCount, item, count, bag = false) => {
    if (flag !== -1) {
        if (items.cart[flag][1] > 1) {
            setCount(items.cart[flag][1] - 1)
            addToCart(item.id, items.cart[flag][1]-1, item.price, items, bag)
        }
    } else {
        if (count > 1) {
            setCount(count => count - 1)
        }
    }
}