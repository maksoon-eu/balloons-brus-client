import {makeAutoObservable} from "mobx";

export default class WorkStore {
    constructor() {
        this._works = []
        this._updateWorks = false
        this._worksLoading = true
        makeAutoObservable(this)
    }

    setWorks(works) {
        this._works = works
    }
    setUpdateWorks(work) {
        this._updateWorks = work
    }
    setWorksLoading(bool) {
        this._worksLoading = bool
    }

    get works() {
        return this._works
    }
    get updateWorks() {
        return this._updateWorks
    }
    get worksLoading() {
        return this._worksLoading
    }
}