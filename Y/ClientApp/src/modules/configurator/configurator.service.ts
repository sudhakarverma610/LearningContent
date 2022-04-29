import { Injectable, Optional, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Product, ProductDTO } from 'src/store/products/products.model';
import { ProductStoreService } from 'src/store/productsStore.service';
import { ConfiguratorStoreService } from './configuratorStore.service';
import { PreviewImageAPIRequest } from './modal/PreviewImageAPIRequest.model';
import { PreviewImageAPIResponse } from './modal/PreviewImageAPIResponse.model';
import { map, tap, catchError } from 'rxjs/operators';
@Injectable()
export class ConfiguratorService {

  public OpenConfigureWindow: Subject<boolean> = new Subject();
  public OpenPopUp: Subject<Product> = new Subject();
  constructor(
    private http: HttpClient,
    private productStore: ProductStoreService,
    private configuratorStore: ConfiguratorStoreService
  ) {
  }

  getConfigurationImage(
    data: PreviewImageAPIRequest
  ): Observable<PreviewImageAPIResponse> {
    return this.http.post<PreviewImageAPIResponse>(
      `/api/configurator`,
      data
    );
  }

  getProduct(sku): Observable<Product> {
    const tempProduct = this.productStore.getProductBySku(sku);
    if (tempProduct) {
      return new Observable<Product>(observer => {
        observer.next(tempProduct);
        observer.complete();
      });
    }

    return this.http.get<ProductDTO>('/api/product_by_sku/' + sku).pipe(
      map(item => {
        if (item.products.length > 0) {
          return item.products[0];
        } else {
          return new Product();
        }
      }),
      tap(item => {
        this.productStore.addSingleProduct(item);
      }),
      catchError(err => {
        return new Observable<Product>(observer => {
          observer.next(new Product());
          observer.complete();
        });
      })
    );
  }

  addToCompareList(
    input: Product,
    openDailog = true
  ): Observable<{ success: boolean; message: string }> {
    const data = this.deepCopy(input);
    return this.configuratorStore.addProductToList(data).pipe(
      map(item => {
        if (item) {
          return { success: true, message: '' };
        } else {
          return {
            success: false,
            message:
              'Maximum Number of item added to Compare Window. Please remove before adding new Items.'
          };
        }
      }),
      tap(item => {
        if (item.success && openDailog) {
          this.OpenPopUp.next(input);
        }
      })
    );
  }

  deepCopy(obj) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = this.deepCopy(obj[attr]);
        }
      }
      return copy;
    }

    return Object.create(obj);
  }
}
