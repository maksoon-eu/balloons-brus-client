import {$authHost, $host} from "./index";

export const changeSlider = async (id, slider) => {
    const {data} = await $authHost.put(`api/slider/${id}`, slider)
    return data
}

export const createSlider = async (slider) => {
    const {data} = await $authHost.post('api/slider', slider)
    return data
}

export const fetchSliders = async () => {
    const {data} = await $host.get('api/slider')
    return data
}