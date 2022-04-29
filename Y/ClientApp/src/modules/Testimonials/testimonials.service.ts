import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaveTestimonialModel,TestimonialResponseDto } from 'src/store/yjStoreModels/testimonials.model';
import { Observable } from 'rxjs';

@Injectable()
export class TestimonialsService {
  constructor(private http: HttpClient) {}

  saveTestinomial(
    testimony: FormData
  ): Observable<{ success: boolean; error: string }> {
    return this.http.post<{ success: boolean; error: string }>(
      '/api/addTestimoniesReview',
      testimony
    );
  }
  getTestinomials(pagenumber:number,limit:number): Observable<TestimonialResponseDto> {
    return this.http.get<TestimonialResponseDto>('/api/getTestimoniesReviewUsingPage?pageNumber='+pagenumber+'&limit='+limit);
  } 
  displayNameAvaible(displayName:string): Observable<{sucess:boolean}> {
    return this.http.get<{sucess:boolean}>('/api/GetDisplayNameAvaible/'+displayName);
  } 
}
