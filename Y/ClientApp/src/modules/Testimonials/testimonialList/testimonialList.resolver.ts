import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { TestimonialResponseDto } from 'src/store/yjStoreModels/testimonials.model';
import { TestimonialsService } from '../testimonials.service';

@Injectable()
export class TestimonialListResolver implements Resolve<any> {
  constructor(private testnomialService:TestimonialsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TestimonialResponseDto> {
    let limit=12;
    return this.testnomialService.getTestinomials(1,limit);
   //return of({data: '', type: 1});
  }
}
