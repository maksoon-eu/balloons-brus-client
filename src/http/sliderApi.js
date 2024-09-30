import { $authHost, $host } from './index';

export const changeSlider = async (id, slider, rotate) => {
    const { data } = await $authHost.put(`api/slider/${id}`, slider, { params: { rotate } });
    return data;
};

export const createSlider = async (slider, rotate) => {
    const { data } = await $authHost.post('api/slider', slider, { params: { rotate } });
    return data;
};

export const fetchSliders = async () => {
    const { data } = await $host.get('api/slider');
    return data;
};
