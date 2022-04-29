import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from 'src/directives/clickOutside.directive';
import { CookiePopUpComponent } from './cookiePopUp/cookiePopUp.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { CssFlexLayoutModule } from 'angular-css-flex-layout';
import { MatIconModule } from '@angular/material/icon';
import {  MatButtonModule } from '@angular/material/button';
import {  MatChipsModule } from '@angular/material/chips';
import { NgxJsonLdModule } from '@ngx-lite/json-ld'; 
import { ProductListItemViewComponent } from './productView/productListItemView.component';
import { RouterModule } from '@angular/router';
import { PipeModule } from 'src/pipes/pipe.module';
import { DiscountPopUpComponent } from './discountPopUP/discountPopup.component';
import { OutOfStockComponent } from './outOfStock/outOfStock.component';
import { PromotionalComponent } from './Promotional/Promotional.component';
import { ConfirmationDialogComponent } from './Confirmation-dialog/Confirmation-dialog.component';
import { RatingComponentComponent } from './ratingComponent/ratingComponent.component';
import { AlertComponent } from './alert/alert.component';
@NgModule({
  declarations: [
    ClickOutsideDirective,
    CookiePopUpComponent,
    BreadcrumbComponent,
    DiscountPopUpComponent,
    ProductListItemViewComponent,
    OutOfStockComponent,
    PromotionalComponent,
    ConfirmationDialogComponent,
    RatingComponentComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CssFlexLayoutModule,
    MatIconModule,
    NgxJsonLdModule,
    MatButtonModule,
    MatChipsModule,
    PipeModule
  ],
  exports: [
    DiscountPopUpComponent,
    CookiePopUpComponent,
    ClickOutsideDirective,
    BreadcrumbComponent,
    ProductListItemViewComponent,
    PromotionalComponent,
    OutOfStockComponent,
    ConfirmationDialogComponent,
    RatingComponentComponent,
    AlertComponent
  ],
  providers: [ ] ,
  entryComponents: [OutOfStockComponent, ConfirmationDialogComponent]
})
export class SharedModule {}
