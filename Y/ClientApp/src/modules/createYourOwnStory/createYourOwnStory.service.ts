import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Poll, PollingAnswer } from './createYourOwnStory.interface';
import { Product } from 'src/store/products/products.model';

@Injectable()
export class CreateYourOwnStoryService {
  public storyStage: BehaviorSubject<number> = new BehaviorSubject(1);
  public polls: Poll[];
  public pollsSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public responseSetCounter = 0;
  public responseSetCounterSubject = 0;
  public resultURL = '';
  public inviteSentSubject: Subject<boolean> = new Subject();
  public unsubscribeSubject: Subject<string> = new Subject();
  public resultProducts = [];
  // tslint:disable-next-line: variable-name
  private _fnalresult: any;
  public storyId: any;
  public profile: any;

  constructor(private http: HttpClient) {
    // this.getAllPolls();
  }
  GetResult() {
    return this._fnalresult;
  }
  SetResult(value: Product[]) {
    return this._fnalresult = value;
  } 
  getAllPolls() {
    this.http
      .get('/ystories/GetAllPolls')
      .subscribe((response: { polls: Poll[] }) => {
        this.polls = response.polls;
        this.pollsSubject.next(true);
      });
  }
  getAllPoll(): Observable<{polls: Poll[]}> {
   return this.http.get<{polls: Poll[]}>('/ystories/GetAllPolls')
   .pipe(
     tap((res: {polls: Poll[]}) => {
      this.polls = res.polls;
     })
   );
  }
  postAnswer(answer: PollingAnswer) {
    this.http
      .get('/ystories/SetPollResponse/' + answer.pollanswer_id)
      .subscribe(value => {
        this.responseSetCounter++;
        this.responseSetCounterSubject = this.responseSetCounter;
        if (this.polls && this.responseSetCounter === this.polls.length) {
          this.responseSetCounter = 0;
        }
        if (this.responseSetCounter === 1) {
          this.resultURL = '';
          this.unsubscribeSubject = new Subject();
        }
      });
  }

  getMyStory(): Observable<{ randomProductsList: string[], profile: any, storyId: any }> {
    this.resultURL = '';
    return this.http.get<{randomProductsList: string[], profile: any, storyId: any}>('/ystories/GetStory');
  }
  GetStoryData(): Observable<[ {polls: Poll[]}, { randomProductsList: string[], profile: any, storyId: any }]> {
   // tslint:disable-next-line: deprecation
   return forkJoin(
     this.getAllPoll(),
     this.getMyStory());
  }
  // tslint:disable-next-line: variable-name
  inviteAFriend(first_name: string, last_name: string, emailId: string) {
    const data = {
      firstName: first_name,
      lastName: last_name,
      email: emailId,
      ImageURL: this.resultURL
    };  

    this.http.post('/api/invite', data).subscribe(value => {
      this.inviteSentSubject.next(true);
    });
  }
  deleteResponse() {
    return this.http.delete('/ystories/deleteResponses');
  }
}
