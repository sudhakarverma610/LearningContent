import {
  Component,
  Output,
  OnInit,
  OnDestroy,
  ElementRef
} from "@angular/core";
import { CommunityChainService } from "../communityChain.service";
import { CategoryModel } from 'src/store/categories/categories.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CategoryStoreService } from 'src/store/categoriesStore.service';

@Component({
  selector: "app-invite-to-chain",
  templateUrl: "./invite.component.html",
  styleUrls: ["./invite.component.scss"]
})
export class InviteToChainComponent implements OnInit, OnDestroy {
  public EmailNotValidMsg = "Email is not valid";
  public InviteSentMsg = "Mail Sent";

  public requiredFieldLogin = false;
  public EmailNotValid = false;
  public inviteSent = false;

  public InviteSentToAll = false;

  public invites: {
    first_name: string;
    last_name: string;
    email: string;
    requiredFieldLogin: boolean;
    EmailNotValid: boolean;
    inviteSent: boolean;
    fieldsRequiredMissing: string;
  }[] = [];

  public category: CategoryModel;

  public unsubscribeSubject: Subject<string> = new Subject();

  constructor(
    private router: Router,
    private communityChainService: CommunityChainService,
    private el: ElementRef,
    private categoryStore: CategoryStoreService
  ) {}

  ngOnInit() {
    this.InviteSentToAll = false;
    this.invites.push({
      first_name: undefined,
      last_name: undefined,
      email: undefined,
      requiredFieldLogin: false,
      EmailNotValid: false,
      inviteSent: false,
      fieldsRequiredMissing: "Required fields are missing"
    });
    this.category = this.categoryStore.getCategoryBySlug("chain-of-charms");
  }

  validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  sendInvitation() {
    let sent = 0;
    let error = 0;
    this.invites.forEach(invite => {
      invite.EmailNotValid = false;
      invite.requiredFieldLogin = false;
      if (invite.first_name && invite.last_name && invite.email) {
        if (!this.validateEmail(invite.email)) {
          invite.EmailNotValid = true;
          error += 1;
        } else {
          this.communityChainService
            .sendInvite([
              {
                email: invite.email,
                first_name: invite.first_name,
                last_name: invite.last_name
              }
            ])
            .subscribe((value: any) => {
              if (value.error) {
                invite.fieldsRequiredMissing = value.error;
                invite.requiredFieldLogin = true;
                error += 1;
              } else {
                invite.inviteSent = true;
                sent += 1;
              }

              if (sent + error === this.invites.length) {
                this.removeSentInvites();
              }
            });
        }
      } else {
        invite.requiredFieldLogin = true;
        error += 1;
      }
    });
    const invalidControl = this.el.nativeElement.querySelector(
      ".form_first_name"
    );
    if (invalidControl) {
      invalidControl.focus();
    }
    document.activeElement.scrollIntoView();
  }

  removeSentInvites() {
    this.invites = this.invites.filter(invite => !invite.inviteSent);
    if (this.invites.length === 0) {
      this.InviteSentToAll = true;
      this.invites.push({
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        requiredFieldLogin: false,
        EmailNotValid: false,
        inviteSent: false,
        fieldsRequiredMissing: "Required fields are missing"
      });
    }
  }

  addAnotherInvite() {
    this.invites.push({
      first_name: undefined,
      last_name: undefined,
      email: undefined,
      requiredFieldLogin: false,
      EmailNotValid: false,
      inviteSent: false,
      fieldsRequiredMissing: "Required fields are missing"
    });
  }

  remove(inviteIndex) {
    this.invites.splice(inviteIndex, 1);
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }
}
