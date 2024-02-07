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
    const {data} = await $host.get('api/type')
    return data
}

export const createItem = async (item, rotate) => {
    const {data} = await $authHost.post('api/item', item, {params: {rotate}})
    return data
}

export const fetchItems = async (typeId, subTypeId, price, page, limit = 4, sort) => {
    const {data} = await $host.get('api/item', {params: {typeId, subTypeId, price, page, limit, sort}})
    return data
}

export const fetchOneItem = async (id) => {
    const {data} = await $host.get(`api/item/${id}`)
    return data
}

export const fetchIdsItem = async (ids) => {
    const {data} = await $host.get(`api/item/ids`, {params: {ids}})
    return data
}

export const changeItem = async (id, item, rotate) => {
    const {data} = await $authHost.put(`api/item/${id}`, item, {params: {rotate}})
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

export const deleteItem = async (id) => {
    const {data} = await $authHost.delete(`api/item/${id}`)
    return data
}