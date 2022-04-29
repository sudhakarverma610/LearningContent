import { Component, OnInit } from '@angular/core';
import { noop } from 'rxjs';
import { SharedService } from '../shared.service';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-cookie-pop-up',
  templateUrl: './cookiePopUp.component.html',
  styleUrls: ['./cookiePopUp.component.scss']
})
export class CookiePopUpComponent implements OnInit {
  public showPopUpBool = false;
  constructor(
    private sharedService: SharedService,
    private appService: AppService
  ) {}

  ngOnInit() {
    if (this.appService.isBrowser) {
      this.sharedService
        .getCookieAcceptanceStatus()
        .subscribe((value: { status: boolean }) => {
          if (!value.status) {
            this.showPopUpBool = true;
            //call here open api 
          }
        });
    }
  }

  showPopUp() {
    this.openModal();
  }

  
  acceptPolicy() {
    this.closeModal();
    this.sharedService.AcceptCookieAcceptance().subscribe(noop);
  }

  openModal() {
    this.showPopUpBool = true;
  }

  closeModal() {
    this.showPopUpBool = false;
  }
}
