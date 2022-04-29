import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { tap } from "rxjs/operators";
import { AppService } from 'src/services/app.service';

export class NotificationsEntity {
  public id: string;
  public notification_id: string;
  public heading: string;
  public content: string;
  public data: string;
  public url: string;
  public icon: string;
  public read: boolean;
  public created_at: Date;
  public CustomerId: Number;

  /**
   * NotificationsEntity
   */
  constructor() {}
}

@Injectable()
export class NotificationService {
  public rewardPoints;
  public notificationState: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public notifications: NotificationsEntity[] = [];
  public totalNotifications: number = 0;

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {}

  getAttributeValue(attrString: string): Observable<string> {
    return this.http.get<string>("/api/get_attribute_value/" + attrString);
  }

  updateAttributeValue(
    attrString: string,
    value: string
  ): Observable<{ success: boolean }> {
    return this.http.get<{ success: boolean }>(
      "/api/update_attribute_value/" + attrString + "?value=" + value
    );
  }

  getWelcomePopUpData(): NotificationsEntity {
    const data = new NotificationsEntity();
    data.notification_id = "1";
    data.url = "/auth/login";
    data.heading = "Hello, welcome to Y! 😉";
    data.content =  
    'Register and get a pair of Sterling Silver Swarovski Studs worth Rs 999/- free on your first order. Sign up now!';
    return data;
  }

  getWelcomePopUp2Data(): NotificationsEntity {
    const data = new NotificationsEntity();
    data.notification_id = "2";
    data.url = "/account";
    data.heading = "Hello, thank you for creating an account with Y! 😉";
    data.content = 'A pair of beautiful Sterling Silver Swarovski Studs worth Rs 999/- has been added to your Cart. You will receive them along with your first order.';
    return data;
  }

  getWelcomePopUp3Data(): NotificationsEntity {
    const data = new NotificationsEntity();
    data.notification_id = "3";
    data.url = "/charms";
    data.heading = "Hello, welcome back to Y! 😉";
    data.content =  'For your first order use "WELCOME10" to get 10% (order value above Rs. 1000) or use "WELCOME20" to get 20% off (order value above Rs. 2500). <br /> Ready to start your charming Y collection?';
    return data;
  }

  getWelcomePopUpStatus(): Observable<string> {
    return this.getAttributeValue("WELCOME_POP_UP").pipe(
      map((res: any) => {
        return res.value;
      })
    );
  }

  getCuratorPopUpData(): NotificationsEntity {
    const data = new NotificationsEntity();
    data.notification_id = "4";
    data.url = "/info/create-your-own-set";
    data.heading = "Add Your Special Dash of Charm!";
    data.content =  "Try our curator tool and create your own charm set! <br /> Create Now!";
    return data;
  }

  getCuratorPopUpStatus(): Observable<boolean> {
    return this.getAttributeValue("CURATOR_POP_UP").pipe(
      map((res: any) => {
        if (res.value === "true") {
          return false;
        }
        return true;
      })
    );
  }

  getRewardPointsPopUpData(): Observable<NotificationsEntity> {
    return this.getRewardPoints().pipe(
      map(result => {
        const data = new NotificationsEntity();
        data.notification_id = "default_7";
        data.url = "/";
        data.heading = "Your Charms Are Calling!";
        data.content =  "You have " +
        result.points +
        " charming credits, worth INR " +
        Math.floor(result.points / 4) +
        " waiting to be spent. Time to pick out your favorites and bring them home.";        
        return data;
      })
    );
  }

  getRewardPointsUpStatus(): Observable<boolean> {
    return this.getRewardPoints().pipe(
      map(res => {
        if (res.points > 1000) {
          return true;
        }
        return false;
      })
    );
  }

  getRewardPoints(): Observable<{ points: number }> {
    if (this.rewardPoints) {
      return new Observable(observer => {
        observer.next(this.rewardPoints);
        observer.complete();
      });
    }

    return this.http.get<{ points: number }>("/api/getRewardPoints").pipe(
      tap(res => {
        this.rewardPoints = res;
      })
    );
  }

  getNotifications(
    read: boolean,
    page: number
  ): Promise<{
    notifications: NotificationsEntity[];
    page: number;
    total: number;
  }> {
    if (!this.appService.isBrowser) {
      return new Observable<{
        notifications: NotificationsEntity[];
        page: number;
        total: number;
      }>(observer => {
        observer.next({
          notifications: [new NotificationsEntity()],
          page: 1,
          total: 5
        });
        observer.complete();
      }).toPromise();
    }
    return this.http
      .get<{
        notifications: NotificationsEntity[];
        page: number;
        total: number;
      }>("/api/getPushNotification?page=" + page + "&read=" + (read ? 1 : 0))
      .toPromise();
  }

  insertNotification(
    input: NotificationsEntity
  ): Promise<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(
        "/api/savePushNotification/",
        { ...input, data: "" }
      )
      .toPromise();
  }

  readNotification(
    input: NotificationsEntity
  ): Promise<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(
        "/api/readPushNotification/" + input.id,
        {}
      )
      .toPromise();
  }
}
