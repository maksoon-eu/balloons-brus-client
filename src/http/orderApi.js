import {$host} from "./index";

export const sendOrder = async (order) => {
    const {data} = await $host.post('api/order', order)
    return data
}

export const sendMessage = async (message) => {
    const {data} = await $host.post('api/order/message', message)
    return data
}