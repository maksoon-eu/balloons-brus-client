import {makeAutoObservable} from "mobx";

export default class SliderStore {
    constructor() {
        this._sliders = []
        this._updateSliders = false
        this._slidersLoading = true
        makeAutoObservable(this)
    }

    setSliders(sliders) {
        this._sliders = sliders
    }
    setUpdateSliders(slider) {
        this._updateSliders = slider
    }
    setSlidersLoading(bool) {
        this._slidersLoading = bool
    }

    get sliders() {
        return this._sliders
    }
    get updateSliders() {
        return this._updateSliders
    }
    get slidersLoading() {
        return this._slidersLoading
    }
}