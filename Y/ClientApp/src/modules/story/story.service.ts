import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { APP_BASE_HREF } from "@angular/common";

@Injectable()
export class StoryService {
  constructor(private http: HttpClient) {}

  getStory(id) {
    return this.http.get("/ystories/getStoryById/" + id);
  }

  getProductForStory(sku) {
    return this.http.get("/api/product_by_sku/" + sku).pipe(
      map((response: any) => {
        return response.products[0];
      })
    );
  }
}
