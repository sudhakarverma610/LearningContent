import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/store/store.service';
import { AppService } from 'src/services/app.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy, OnInit {
  public openTabs = false;
  public orderNavigator = false;
  constructor(
    private store: StoreService,
    private appService: AppService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
        this.store.loginStatusSubject.subscribe(value => {
      if (!value) {
        this.router.navigate(['/']);
      }
    });
        this.appService.loader.next(false);
  }

  logout() {
    this.authService.logout();
  }
  // scrollRigth() {
  //   let elmnt = document.getElementById('nav');
  //   elmnt.scrollTo(elmnt.clientWidth, 0);
  // }
  // isScrollLeftIconShow(){
  //   var elmnt = document.getElementById("nav");
  //   return (elmnt.scrollLeft!==0);
  // }
  // isScrollRigthIconShow(){
  //   var elmnt = document.getElementById("nav");
  //   return (elmnt.scrollLeft===0);

  // }
  // scrollLeft() {
  //   let elmnt = document.getElementById('nav');
  //   elmnt.scrollTo(0, 0);
  // }
  isShowLeftRigthScroll(elmnt: HTMLElement, isleft: boolean= true): boolean {
    if (!elmnt) {
      return false;
    }
    const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
    if (maxScrollLeft === 0) {
        return false;
      }
    const returnvalue = isleft ? (elmnt.scrollLeft === 0 ? false : true) :
                                 (elmnt.scrollLeft === maxScrollLeft ? false : true);
    return returnvalue;
   }
  scrollRigth(elmnt: HTMLElement)  {
    if (!elmnt) {
      return;
    }
    const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
    if (maxScrollLeft === 0) {
        return;
      }
    const leftScrollWidth = elmnt.scrollLeft;
    elmnt.scrollLeft = (leftScrollWidth + 100) > maxScrollLeft ? maxScrollLeft : (leftScrollWidth + 100);
  }
  scrollLeft(elmnt: HTMLElement)  {
    if (!elmnt) {
      return;
    }
    const maxScrollLeft = elmnt.scrollWidth - elmnt.clientWidth;
    if (maxScrollLeft === 0) {
        return;
      }
    const leftScrollWidth = elmnt.scrollLeft;
    elmnt.scrollLeft = (leftScrollWidth - 100) < 0 ? 0 : (leftScrollWidth - 100);
  }
  ngOnDestroy() {}
}
