import {makeAutoObservable} from "mobx";

export default class ItemStore {
    constructor() {
        this._types = []
        this._items = []
        this._itemsSlider1 = []
        this._itemsSlider2 = []
        this._itemsSlider3 = []
        this._selectedType = {}
        this._selectedPrice = {}
        this._sliderTypes = []
        this._updateTypes = false
        this._page = 1
        this._totalCount = 0
        this._limit = 4
        this._typesLoading = true
        this._itemsLoading = true
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }
    setUpdateTypes(type) {
        this._updateTypes = type
    }
    setSliderTypes(types) {
        this._sliderTypes = types
    }
    setItems(items) {
        this._items = items
    }
    setItemsSlider1(items) {
        this._itemsSlider1 = items
    }
    setItemsSlider2(items) {
        this._itemsSlider2 = items
    }
    setItemsSlider3(items) {
        this._itemsSlider3 = items
    }
    setTypesLoading(bool) {
        this._typesLoading = bool
    }
    setItemsLoading(bool) {
        this._itemsLoading = bool
    }
    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }
    setSelectedPrice(price) {
        this.setPage(1)
        this._selectedPrice = price
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    get types() {
        return this._types
    }
    get updateTypes() {
        return this._updateTypes
    }
    get sliderTypes() {
        return this._sliderTypes
    }
    get items() {
        return this._items
    }
    get itemsSlider1() {
        return this._itemsSlider1
    }
    get itemsSlider2() {
        return this._itemsSlider2
    }
    get itemsSlider3() {
        return this._itemsSlider3
    }
    get typesLoading() {
        return this._typesLoading
    }
    get itemsLoading() {
        return this._itemsLoading
    }
    get selectedType() {
        return this._selectedType
    }
    get selectedPrice() {
        return this._selectedPrice
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
}