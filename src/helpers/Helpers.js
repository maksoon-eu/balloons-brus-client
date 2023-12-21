export const addToCart = (id, count, price, items) => {
    console.log(count)
    const cart = localStorage.getItem('cart')
    if (!cart) {
        localStorage.setItem('cart', JSON.stringify([[id, count, price]]))
    } else {
        if (JSON.parse(cart).some(item => item[0] === id)) {
            if (JSON.parse(cart).some(item => item[1] === count)) {
                localStorage.setItem('cart', JSON.stringify(JSON.parse(cart).filter(item => item[0] !== id)));
            } else {
                const data = JSON.parse(cart);
                data.forEach(item => {
                    if (item[0] === id) {
                        item[1] = count;
                    }
                });
                localStorage.setItem('cart', JSON.stringify(data));
            }
        } else {
            localStorage.setItem('cart', JSON.stringify([...JSON.parse(cart), [id, count, price]]))
        }
    }
    items.setCart(JSON.parse(localStorage.getItem('cart')))
}