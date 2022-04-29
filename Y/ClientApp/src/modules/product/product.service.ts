import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
const ENTITY_TYPE = makeStateKey('entitytype');
const ENTITY_TYPE_SLUG = makeStateKey('entitytypeslug');
@Injectable()
export class ProductService {
    public entities: {
      id: string;
      data: { type: number; categorySename: string };
    }[] = [];
    constructor(private http: HttpClient, private state: TransferState) { }
    getEntityType(
      sename: string
    ): Observable<{ type: number; categorySename: string; sename: string }> {
      // checks if data has been set on server with ssr
      if (this.state.get(ENTITY_TYPE_SLUG, null as any) === sename) {
        return new Observable(observer => {
          observer.next(this.state.get(ENTITY_TYPE, null as any));
          observer.complete();
        });
      }
      const savedData = this.entities.find(it => it.id === sename);
      if (savedData) {
        return new Observable(observer => {
          observer.next({ ...savedData.data, sename });
          observer.complete();
        });
      }
      return this.http
        .get<{ type: number; categorySename: string }>(
          "/api/getEntityType/" + sename
        )
        .pipe(
          map(item => {
            this.state.set(ENTITY_TYPE_SLUG, sename);
            this.state.set(ENTITY_TYPE, { ...item, sename });
            this.entities.push({ id: sename, data: item });
            return { ...item, sename };
          })
        );
    }
}
