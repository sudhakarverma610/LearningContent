import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { noop } from 'rxjs';

export class GoogleAnalyticsService {
    constructor(private httpClient: HttpClient) { }
    

    pageView(event) {
        this.httpClient.get(`api/GoogleAnalytics/PageView?content_type=${event.url}&userId=${event.id}`).subscribe(noop);
    }

    impressionView(data) {
        this.httpClient.post(`api/GoogleAnalytics/EECImpressionViewEvent`, data).subscribe(noop);
    }

    action(data, action) {
        this.httpClient.post(`api/GoogleAnalytics/ProductDetail/${action}`, data).subscribe(noop);
    }

    checkout(data) {
        this.httpClient.post('api/GoogleAnalytics/CheckOut', data).subscribe(noop);
    }

    payments(option, step) {
        this.httpClient.get(`api/GoogleAnalytics/CheckoutOption?option=${option}&step=${step}`).subscribe(noop);
    }

    checkoutStep(data, step) {
        this.httpClient.post(`api/GoogleAnalytics/CheckOutStep/${step}`, data).subscribe(noop);
    }

    productClick(data, listType) {
        this.httpClient.post(`api/GoogleAnalytics/ProductClick/${listType}`, data).subscribe(noop);
    }
}