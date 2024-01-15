import {makeAutoObservable} from "mobx";

export default class ItemStore {
    constructor() {
        this._types = []
        this._items = []
        this._item = []
        this._cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        this._cartItems = []
        this._updateCart = false
        this._itemsSimilar = []
        this._itemsSlider1 = []
        this._itemsSlider2 = []
        this._itemsSlider3 = []
        this._selectedType = null
        this._selectedSubType = null
        this._selectedPrice = {}
        this._sliderTypes = []
        this._itemsSort = ["updatedAt", "DESC"]
        this._updateTypes = false
        this._updateList = false
        this._page = 1
        this._totalCount = 0
        this._limit = 4
        this._typesLoading = false
        this._itemsLoading = 'loading'
        this._cartLoading = false
        this._totalPrice = false
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }
    setUpdateTypes(type) {
        this._updateTypes = type
    }
    setUpdateList(bool) {
        this._updateList = bool
    }
    setUpdateCart(bool) {
        this._updateCart = bool
    }
    setItemsSort(sort) {
        this._itemsSort = sort
    }
    setSliderTypes(types) {
        this._sliderTypes = types
    }
    setItems(items) {
        this._items = items
    }
    setItem(item) {
        this._item = item
    }
    setCart(item) {
        this._cart = item
    }
    setCartItems(items) {
        this._cartItems = items
    }
    setSimilarItems(items) {
        this._itemsSimilar = items
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
    setCartLoading(bool) {
        this._cartLoading = bool
    }
    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }
    setSelectedSubType(subType) {
        this.setPage(1)
        this._selectedSubType = subType
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
    setTotalPrice(price) {
        this._totalPrice = price
    }

    get types() {
        return this._types
    }
    get updateTypes() {
        return this._updateTypes
    }
    get updateList() {
        return this._updateList
    }
    get updateCart() {
        return this._updateCart
    }
    get itemsSort() {
        return this._itemsSort
    }
    get sliderTypes() {
        return this._sliderTypes
    }
    get items() {
        return this._items
    }
    get item() {
        return this._item
    }
    get cart() {
        return this._cart
    }
    get cartItems() {
        return this._cartItems
    }
    get similarItems() {
        return this._itemsSimilar
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
    get cartLoading() {
        return this._cartLoading
    }
    get selectedType() {
        return this._selectedType
    }
    get selectedSubType() {
        return this._selectedSubType
    }
    get selectedPrice() {
        return this._selectedPrice
    }
    get totalCount() {
        return this._totalCount
    }
    get totalPrice() {
        return this._totalPrice
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
}