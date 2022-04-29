import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CreateYourOwnStoryService } from '../createYourOwnStory.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit, OnDestroy {
  public fieldsRequiredMissing = 'Required fields are missing';
  public EmailNotValidMsg = 'Email is not valid';
  public InviteSentMsg = 'Mail Sent';

  public requiredFieldLogin = false;
  public EmailNotValid = false;
  public inviteSent = false;

  public first_name: string;
  public last_name: string;
  public email: string;

  public unsubscribeSubject: Subject<string> = new Subject();

  constructor(
    private router: Router,
    private createYourOwnStoryService: CreateYourOwnStoryService
  ) {}

  ngOnInit() {
    if (
      !this.createYourOwnStoryService.resultURL.length ||
      this.createYourOwnStoryService.resultURL.length === 0
    ) {
      this.router.navigate(['tellmey']);
    }
    this.createYourOwnStoryService.inviteSentSubject
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(value => {
        if (value) {
          this.inviteSent = true;
        }
      });
  }

  validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  sendInvitation() {
    this.EmailNotValid = false;
    this.requiredFieldLogin = false;
    if (this.first_name && this.last_name && this.email) {
      if (this.validateEmail(this.email)) {
        this.createYourOwnStoryService.inviteAFriend(
          this.first_name,
          this.last_name,
          this.email
        );
      } else {
        this.EmailNotValid = true;
      }
    } else {
      this.requiredFieldLogin = true;
    }
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
