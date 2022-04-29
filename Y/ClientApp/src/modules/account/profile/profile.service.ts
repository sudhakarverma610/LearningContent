import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import {
  Customer,
  State,
  AddressesItem
} from 'src/store/Customer/customer.model';
import { AuthService } from 'src/services/auth.service';
import { CustomerStoreService } from 'src/store/customerStore.service';
import { map, tap } from 'rxjs/operators';
import { ShipmentDetailsModel } from './myOrders/shipmentDetailsModel';
import { PincodeDataModel } from 'src/store/yjStoreModels/PincodeData.model';
import { ChainOfCharm } from './mycredits/chainOfCharm.model';
import { saveAs } from 'file-saver';
import { OrderItemRating, OrderReturnRequest } from './model';
import { Order, OrderRootObject, OrderSettings } from 'src/store/order.model';
import { makeStateKey } from '@angular/platform-browser';

@Injectable()
export class ProfileService {
  public myDetailsSubject: BehaviorSubject<any> = new BehaviorSubject({});
  public addressSubject: Subject<boolean> = new Subject();
  public addressSetSubject: Subject<boolean> = new Subject();
  public statesSubject: Subject<boolean> = new Subject();
  public deleteAddressSubject: Subject<boolean> = new Subject();
  public editProfileSubject: Subject<boolean> = new Subject();
  public deleteAccountSubject: BehaviorSubject<any> = new BehaviorSubject({});
  public exportDataSubject: BehaviorSubject<any> = new BehaviorSubject({});
  public myOrdersSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  public myOrders = [];
  public customer;
  public states;
  private order_setting: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private customerStore: CustomerStoreService
  ) {
    this.myOrders = [];
    this.authService.loginStatusSubject.subscribe(value => {
      if (value) {
        this.fetchAccountDetails();
      }
    });
  }

  FetchOrderSettings(): Observable<OrderSettings> {
     if (this.order_setting) {
      return  of(this.order_setting);
    } else {
     return this.http.get<OrderSettings>('/api/OrderSettings')
      .pipe(
        (map(
          (value) => {
            this.order_setting = value;
            return value;
          }
        ))
      );
    }

  }
  fetchAccountDetails() {
    this.http
      .get('/api/me')
      .pipe(
        map((item: { customers: Customer[] }) => {
          this.customerStore.setCustomer(item.customers[0]);
          return item;
        })
      )
      .subscribe(response => {
        this.customer = (response as any).customers[0];
        this.myDetailsSubject.next((response as any).customers[0]);
      });
  }
  UpdateNewLetter(newLetter: boolean) {
    return this.http.get<{status: boolean, message: string}>('/api/updateNewLetterStatus/' + newLetter)
      .pipe( map(
        () => {
          this.customer.subscribed_to_newsletter =  newLetter;
          this.myDetailsSubject.next(this.customer);
          }));
  }
  removeExternalAssociation(id) {
    this.http
      .get('/api/removeExternalAssociation/' + id)
      .pipe(
        map((item: { customers: Customer[] }) => {
          this.customerStore.setCustomer(item.customers[0]);
          return item;
        })
      )
      .subscribe(response => {
        this.customer = (response as any).customers[0];
        this.myDetailsSubject.next((response as any).customers[0]);
      });
  }

  saveAddress(data) {
    return this.http.put('/api/editaddress', data).pipe(
      map(response => {
        this.addressSubject.next(true);
        return true;
      })
    );
  }

  deleteAccount() {
    this.http.get('/api/gdpr_delete').subscribe(response => {
      this.deleteAccountSubject.next(response);
    });
  }

  exportData() {
    this.http.post('/api/gdpr_export', '', { responseType: 'blob' }).subscribe(
      response => {
        saveAs(response, 'data.xlsx');
        this.exportDataSubject.next(response);
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteAddress(addressId) {
    this.http.get('/api/deleteaddres/' + addressId).subscribe(value => {
      this.deleteAddressSubject.next(true);
    });
  }

  addAddress(data: AddressesItem): Observable<{ message: string }> {
    if (data.id && data.id !== '') {
      return this.http.put<{ message: string }>('/api/editaddress', data).pipe(
        map(item => {
          this.customerStore.setCustomerFetched(false);
          return item;
        })
      );
    }

    return this.http.post<{ message: string }>('/api/addaddress', data).pipe(
      map(item => {
        this.customerStore.setCustomerFetched(false);
        return item;
      })
    );
  }

  setAsShipping(address) {
    this.http.post('/api/setshippingaddressbyid', address).subscribe(value => {
      this.addressSetSubject.next(true);
    });
  }

  setAsBilling(address) {
    this.http.post('/api/setbillingaddressbyid', address).subscribe(value => {
      this.addressSetSubject.next(true);
    });
  }

  getStates() {
    if (this.customerStore.getStatesStatus()) {
      return of(this.customerStore.getStates());
    }
    return this.http
      .get<State[]>('/country/getstatesbycountryid?countryId=133')
      .pipe(
        tap(item => {
          this.customerStore.setStates(item);
        })
      );
  }

  editProfile(data) {
    return this.http.put('/api/editcustomer', data).pipe(
      map(value => {
        this.editProfileSubject.next(true);
        return true;
      })
    );
  }

  getMyOrders(page, limit) {
    const data = {
      page,
      limit
    };
    return this.http.post('/api/orders/customer', data);
  }

  track(id: number): Observable<ShipmentDetailsModel[]> {
    return this.http.get<ShipmentDetailsModel[]>('/api/getShippingDetails/' + id);
  }

  getPincodeData(pincode): Observable<PincodeDataModel> {
    return this.http.get<PincodeDataModel>('/api/pincodeDetails/' + pincode);
  }

  reorder(orderId) {
    return this.http.get('/api/reorder/' + orderId);
  }

  getRewardPoints(): Observable<{ points: number }> {
    return this.http.get<{ points: number }>('/api/getRewardPoints');
  }

  getRewardPointDetails(): Observable<{ history: RewardHistory[] }> {
    return this.http.get<{ history: RewardHistory[] }>(
      '/api/getRewardPointDetails'
    );
  }

  getChainOfCharm(): Observable<ChainOfCharm> {
    return this.http.get<ChainOfCharm>('/api/getChainOfCharm');
  }

  orderCancel(id): Observable<{ success: string; message: string }> {
    return this.http.get<{ success: string; message: string }>(
      '/api/CancelOrder/' + id
    );
  }
  getOrder(id): Observable<any> {
    return this.http.get(
      '/api/orders/' + id
    );
  }

  getOrderItemRating(id): Observable<OrderItemRating[]> {
    return this.http.get<OrderRootObject>(
      '/api/orders/' + id
    ).pipe(
      map(res => {
       return res.orders[0].order_items.map(item => {

          const orderItemRating: OrderItemRating = {
             orderItemId: item.id,
             orderItem: item,
             comment: 'Product Rating By Product End ',
             rate: 0,
             orderId: id
          };
          return orderItemRating;
        });
        })
    );
  }
  getReturnRequest(id): Observable<any> {
    return this.http.get<OrderReturnRequest>(
      '/api/returnRequest/' + id
    );
  }

  postReturnRequest(orderReturnRequest): Observable<{ success: string; message: string }> {
    return this.http.post<{ success: string; message: string }>('/api/ReturnOrder', orderReturnRequest);
  }
  uploadPicture(formfile): Observable<{ success: string; message: string; data: number }> {
    return this.http.post<{ success: string; message: string; data: number }>('/api/UploadImage', formfile);
  }
  postOrderItemRating(orderItems: OrderItemRating[]) {
    return this.http.post<{status: boolean; error: string}>('/api/postRatinng', orderItems);
  }
}

export interface RewardHistory {
  points: number;
  message: string;
  createdOnUtc: string;
}
