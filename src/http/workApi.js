import {$authHost, $host} from "./index";

export const deleteWork = async (id) => {
    const {data} = await $authHost.delete(`api/work/${id}`)
    return data
}

export const createWork = async (work, rotate) => {
    const {data} = await $authHost.post('api/work', work, {params: {rotate}})
    return data
}

export const fetchWorks = async () => {
    const {data} = await $host.get('api/work')
    return data
}

export const changeWork = async (id, work, rotate) => {
    const {data} = await $authHost.put(`api/work/${id}`, work, {params: {rotate}})
    return data
}