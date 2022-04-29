import { Injectable } from '@angular/core';

@Injectable()
export class InfoStoreService {
    public infoData: Infodata[] = [];
    constructor() { }

    setData(url, data) {
        // tslint:disable-next-line: no-use-before-declare
        this.infoData.push(new Infodata(url, data));
    }

    getData(url) {
        return this.infoData.find(item => item.url === url);
    }
}

export class Infodata {
    url: string;
    data: any;

    constructor(url, body) {
        this.url = url;
        this.data = body;
    }
}
