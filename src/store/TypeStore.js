import { makeAutoObservable } from 'mobx';

export default class ItemStore {
    constructor() {
        this._types = [];
        this._sliderTypes = [];
        this._updateTypes = false;
        this._typesLoading = false;
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }
    setUpdateTypes(type) {
        this._updateTypes = type;
    }
    setSliderTypes(types) {
        this._sliderTypes = types;
    }
    setTypesLoading(bool) {
        this._typesLoading = bool;
    }

    get types() {
        return this._types;
    }
    get updateTypes() {
        return this._updateTypes;
    }
    get sliderTypes() {
        return this._sliderTypes;
    }
    get similarItems() {
        return this._itemsSimilar;
    }
    get typesLoading() {
        return this._typesLoading;
    }
}
