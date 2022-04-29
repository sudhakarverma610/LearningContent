import { Injectable, Inject } from "@angular/core";
import {
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { StoreService } from 'src/store/store.service';
import { Observable } from 'rxjs';
import { retry, map } from 'rxjs/operators';
import { NotificationHandlerService } from 'src/modules/notification/notification.handle.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  baseUrl: string;
  constructor(
    private store: StoreService,
    @Inject("BASE_API_URL") baseUrl: string,
    private notificationHandler: NotificationHandlerService
  ) {
    this.baseUrl = baseUrl;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const req1 = req.clone({ url: `${this.baseUrl}${req.url}` });
    //console.log(`${this.baseUrl}${req.url}` );
    // Get the auth token from the service.
    let authToken;
    if (this.store.getLoginStatus()) {
      authToken = this.store.getLoginToken();
    } else {
      authToken = this.store.getToken();
    }

    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // Clone the request and set the new header in one step.
    let authReq;
    if (this.store.getTokenStatus) {
      authReq = req1.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` }
      });
    } else {
      authReq = req1.clone();
    }

    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(
      retry(1),
      map(res => {
        if (res instanceof HttpResponse && res.body.notification_sent) {
            this.notificationHandler.newNotification.next(res.body.notification);
        }         
        return res;
      })
    );
  }
}
