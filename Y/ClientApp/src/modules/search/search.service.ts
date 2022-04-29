import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/store/products/products.model';

@Injectable()
export class SearchService {
    public StoredFilterEvent: { slug: string; event: any };
    constructor(
        private http: HttpClient
    ) { }

    searchQuery(input: string, page = 1) {
      return this.http.get<{ list: Product[] }>(
        "/api/searchProductsByString?q=" + input + "&page=" + page
      );
    }
}