import { $authHost, $host } from './index';

export const createItem = async (item, rotate) => {
    const { data } = await $authHost.post('api/item', item, { params: { rotate } });
    return data;
};

export const fetchItems = async (typeId, subTypeId, price, page, limit = 4, sort) => {
    const { data } = await $authHost.get('api/item', {
        params: { typeId, subTypeId, price, page, limit, sort },
    });
    return data;
};

export const fetchOneItem = async (id) => {
    const { data } = await $authHost.get(`api/item/${id}`);
    return data;
};

export const fetchIdsItem = async (ids) => {
    const { data } = await $authHost.get(`api/item/ids`, { params: { ids } });
    return data;
};

export const changeItem = async (id, item, rotate) => {
    const { data } = await $authHost.put(`api/item/${id}`, item, { params: { rotate } });
    return data;
};

export const deleteItem = async (id) => {
    const { data } = await $authHost.delete(`api/item/${id}`);
    return data;
};
