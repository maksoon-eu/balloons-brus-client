import {makeAutoObservable} from "mobx";

export default class ItemStore {
    constructor() {
        this._items = []
        this._item = []
        this._cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        this._cartItems = []
        this._updateCart = false
        this._itemsSimilar = []
        this._itemsSlider1 = []
        this._itemsSlider2 = []
        this._itemsSlider3 = []
        this._selectedPrice = {}
        this._itemsSort = ["updatedAt", "DESC"]
        this._updateList = false
        this._page = 1
        this._totalCount = 0
        this._limit = 4
        this._itemsLoading = 'loading'
        this._cartLoading = false
        this._totalPrice = false
        makeAutoObservable(this)
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
    setItemsLoading(bool) {
        this._itemsLoading = bool
    }
    setCartLoading(bool) {
        this._cartLoading = bool
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

    get updateList() {
        return this._updateList
    }
    get updateCart() {
        return this._updateCart
    }
    get itemsSort() {
        return this._itemsSort
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
    get itemsLoading() {
        return this._itemsLoading
    }
    get cartLoading() {
        return this._cartLoading
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