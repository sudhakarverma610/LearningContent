// import { Injectable } from '@angular/core';

// import {
//   Resolve,
//   RouterStateSnapshot,
//   ActivatedRouteSnapshot} from '@angular/router';
// import { Observable } from 'rxjs';
// import { flatMap } from 'rxjs/operators';
// import { ConfiguratorStoreService } from '../configuratorStore.service';
// import { UserCreationService } from '../userCreation.service';

// @Injectable()
// export class LandingConfiguratorResolver implements Resolve<any> {
//   constructor(private userCreationService: UserCreationService,
//               private configuratorStore: ConfiguratorStoreService) {}

//   resolve(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<any> {
//     this.configuratorStore.fetchCompareList().pipe(flatMap(it => {
//             return it;
//     })
//     );
//     let data = this.userCreationService.getAllUserCreations();
//     return  null;
//   }
// }
