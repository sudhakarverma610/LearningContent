import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { BannersModel } from "src/store/yjStoreModels/banners.model";
import { TopicModel } from "src/store/yjStoreModels/topic.model";
import { TestimonialResponse } from "src/store/yjStoreModels/testimonials.model";
import { AppService } from 'src/services/app.service';
import { StoreSettings } from "./yjStoreModels/StoreSettings";

@Injectable()
export class StoreService {
  public APIToken: string; // variable to store the API token needed to make calls to the server
  public APITokenStatus = false; // variable to store if the token has been fetched or not

  public navOpenSubject = new Subject(); // Subject to fire an event that nav has been opened or closed

  public loginToken; // variable to store the login token after user logs in.
  public loginStatus = false; // variable to store that user has logged in or not
  public loginStatusSubject: Subject<boolean> = new Subject(); // Subject to fire an event that user has logged in or logged out

  public discounts = [];
  public discountUpdated = new Subject();
  public showDiscount: BehaviorSubject<{
    view: boolean;
    banner: string;
  }> = new BehaviorSubject({ view: false, banner: "" });

  public showMasoom: BehaviorSubject<{
    masoomView: boolean;
    masoomText: string;
  }> = new BehaviorSubject({ masoomView: false, masoomText: "" });

  // Banners
  public banners: BannersModel;
  public BannersStatus = false;

  // about store
  public aboutUs: TopicModel;
  public AboutUsStatus = false;

  // store testimonials
  public testimonials: TestimonialResponse;
  public testimonialsStatus = false;
  public closeNavDropPanel: Subject<boolean> = new Subject();
  public CurrentStoreSetting: StoreSettings;
   constructor(private appService: AppService) {}
  getToken() {
    return this.APIToken;
  }
  setToken() {
    this.APIToken = "";
    this.APITokenStatus = true;
  }
  getTokenStatus() {
    return this.APITokenStatus;
  }

  getLoginToken() {
    return this.loginToken;
  }

  syncWithLocalStorage() {}

  setLoginToken() {
    this.loginToken = "";
    this.loginStatus = true;
    this.loginStatusSubject.next(true);
  }

  logout() {
    this.loginToken = undefined;
    this.loginStatus = false;
    this.loginStatusSubject.next(false);
  }

  getLoginStatus() {
    return this.loginStatus;
  }

  setDiscountStatus(id, status) {
    const elementPos = this.discounts.find(item => item.id === id);
    if (elementPos) {
      let elementPos = this.discounts
        .map(item => {
          return item.id;
        })
        .indexOf(id);
      this.discounts[elementPos].status = status;
    } else {
      this.discounts.push({
        id: id,
        status: status,
        fetched: true
      });
    }
    this.discountUpdated.next();
  }

  getDiscountStatus(id) {
    const discount = this.discounts.find(value => value.id === id);
    if (discount) {
      return discount.status;
    } else {
      return false;
    }
  }

  getDiscountFetchingStatus(id) {
    const discount = this.discounts.find(value => value.id === id);
    if (discount) {
      return discount.fetched;
    } else {
      return false;
    }
  }

  getBanners() {
    return this.banners;
  }

  setBanners(input: BannersModel) {
    this.banners = input;
  }

  getBannersStatus() {
    return this.BannersStatus;
  }

  getAboutUs() {
    return this.aboutUs;
  }

  setAboutUs(input: TopicModel) {
    this.aboutUs = input;
    this.AboutUsStatus = true;
  }

  getAboutUsStatus() {
    return this.AboutUsStatus;
  }

  getTestimonials() {
    return this.testimonials;
  }

  setTestimonials(input: TestimonialResponse) {
    this.testimonials = input;
    this.testimonialsStatus = true;
  }

  getTestimonialsStatus() {
    return this.testimonialsStatus;
  }
  setCurrentStore(input: StoreSettings) {
      this.CurrentStoreSetting = input;
  }
  getCurrentStore() {
    return this.CurrentStoreSetting;
  }
}
