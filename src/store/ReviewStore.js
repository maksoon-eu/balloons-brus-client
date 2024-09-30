import { makeAutoObservable } from 'mobx';

export default class ReviewStore {
    constructor() {
        this._reviews = [];
        this._updateReviews = false;
        this._reviewsLoading = true;
        makeAutoObservable(this);
    }

    setUpdateReviews(review) {
        this._updateReviews = review;
    }
    setReviews(reviews) {
        this._reviews = reviews;
    }
    setReviewsLoading(bool) {
        this._reviewsLoading = bool;
    }

    get reviews() {
        return this._reviews;
    }
    get updateReviews() {
        return this._updateReviews;
    }
    get reviewsLoading() {
        return this._reviewsLoading;
    }
}
