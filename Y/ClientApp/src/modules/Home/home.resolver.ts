import { Injectable } from "@angular/core";
import { HomeService } from "./home.service";

import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { BannersModel } from "src/store/yjStoreModels/banners.model";
import { FeaturedBestSellers } from "src/store/yjStoreModels/featuredBestsellers.model";
import { TopicModel } from "src/store/yjStoreModels/topic.model";
import { TestimonialResponse } from "src/store/yjStoreModels/testimonials.model";

@Injectable()
export class HomeResolver implements Resolve<any> {
  constructor(private homeService: HomeService) {}

  resolve(): Observable<
    [BannersModel, FeaturedBestSellers, TopicModel, TestimonialResponse]
  > {
    const homeData = this.homeService.getHome();
    return homeData;
  }
}
