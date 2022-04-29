import { Injectable } from '@angular/core';
import {
  Customer,
  State,
  AddressesItem,
  AddressFormValidation
} from './Customer/customer.model';
import { PincodeDataModel } from './yjStoreModels/PincodeData.model';
import { Subject } from 'rxjs';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { AppService } from 'src/services/app.service';

declare global {
  interface Window {
    dataLayer: any;
  }
}

@Injectable()
export class CustomerStoreService {
  public customer: Customer;
  public customerFetched: boolean;
  public customerUpdated: Subject<Customer> = new Subject<Customer>();
  public dataLayerPush = false;

  public states: State[];
  public statesFetched: boolean;

  public postalCode: { code: number; data: PincodeDataModel }[] = [];

  public CashOnDeliveryStatus = true;

  public isCheckout = false;

  public customerStatus: {
    id: number;
    email: string;
    isGuest: boolean;
    isActive: boolean;
    isRegisterred: boolean;
  };

  constructor(
    private appService: AppService,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager
  ) {}

  getCustomer() {
    return this.customer;
  }

  getCustomerStatus() {
    return this.customerStatus;
  }

  setCustomerStatus(input: {
    id: number;
    email: string;
    isGuest: boolean;
    isActive: boolean;
    isRegisterred: boolean;
  }) {
    this.customerStatus = input;
    if (this.customerStatus && this.appService.isBrowser) {
      window.localStorage.setItem('userId', this.customerStatus.id.toString());
      if (this.customerStatus.isRegisterred && !this.dataLayerPush) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'login',
          userId: this.customerStatus.id
        });
        this.angulartics2GoogleTagManager.setUsername(
          this.customerStatus.id.toString()
        );
        this.dataLayerPush = true;
      }
    }
    if (
      this.customerStatus &&
      !this.customerStatus.isRegisterred &&
      this.dataLayerPush
    ) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'logout' });
      this.angulartics2GoogleTagManager.setUsername(null);
      this.dataLayerPush = false;
    }
  }

  setCustomer(input: Customer) {
    this.customer = input;
    this.customerFetched = true;
    this.customerUpdated.next(this.customer);
  }

  getCustomerFetchedStatus() {
    return this.customerFetched;
  }

  setCustomerFetched(input) {
    this.customerFetched = input;
  }

  getStates() {
    return this.states;
  }

  setStates(input: State[]) {
    this.states = input;
    this.statesFetched = true;
  }

  getStatesStatus() {
    return this.statesFetched;
  }

  getPostalData(code: number) {
    if (this.postalCode.length > 0) {
      const found = this.postalCode.find(item => item.code === code);
      return found ? found.data : null;
    }
    return null;
  }

  setPostalData(code: number, data: PincodeDataModel) {
    this.postalCode.push({ code, data });
  }
}
