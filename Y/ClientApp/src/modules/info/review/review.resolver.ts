import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FormObject } from './mauticForm.model';
import { InfoService } from '../info.service';

export class ReviewResolver implements Resolve<FormObject> {

    /**
     *
     */
    constructor(private service: InfoService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<FormObject> | Promise<FormObject> | FormObject {
        return this.service.getMauticFormData(10);
    }
}