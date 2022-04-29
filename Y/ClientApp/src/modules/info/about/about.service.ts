// import { Injectable, Optional, Inject } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import { BehaviorSubject, of } from "rxjs";
// import { APP_BASE_HREF } from "@angular/common";
// import { map, catchError } from "rxjs/operators";
// import { Router } from "@angular/router";

// @Injectable()
// export class AboutService {
//   public about: BehaviorSubject<any> = new BehaviorSubject("");
//   public baseUrl = "/api/topic";
//   constructor(private http: HttpClient, private router: Router) {
//     this.baseUrl = `${this.baseUrl}`;
//   }

//   fetchAbout() {
//     const url = this.baseUrl + "/about-us-1";
//     return this.http.get(url).pipe(
//       map((response: any) => {
//         return response.body;
//       }),
//       catchError(err => {
//         console.log(err);
//         this.router.navigateByUrl("/");
//         return of([]);
//       })
//     );
//   }
// }
