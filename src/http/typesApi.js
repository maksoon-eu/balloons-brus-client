import {$authHost, $host} from "./index";

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const deleteType = async (id) => {
    const {data} = await $authHost.delete(`api/type/${id}`)
    return data
}

export const createSubType = async (type) => {
    const {data} = await $authHost.post('api/type/subType', type)
    return data
}

export const deleteSubType = async (id) => {
    const {data} = await $authHost.delete(`api/type/subType/${id}`)
    return data
}

export const fetchTypes = async () => {
    const {data} = await $authHost.get('api/type')
    return data
}

export const fetchSliderType = async () => {
    const {data} = await $authHost.get(`api/type/sliderType`)
    return data
}

export const changeSliderType = async (id, typeId) => {
    const {data} = await $authHost.put(`api/type/sliderType/${id}`, typeId)
    return data
}