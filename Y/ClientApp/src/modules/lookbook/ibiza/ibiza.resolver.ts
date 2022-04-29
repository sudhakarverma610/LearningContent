import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductDTO } from 'src/store/products/products.model';
import { LookbookService } from '../lookbook.service';

@Injectable()
export class IbizaResolver implements Resolve<any> {
  constructor(private service: LookbookService) {}

  resolve(): Promise<ProductDTO> {
    return this.service.fetchProductsForCategory(73, 1);
  }
}
